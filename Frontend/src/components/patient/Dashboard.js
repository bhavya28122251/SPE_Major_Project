import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, List, ListItem, 
  ListItemText, Divider, Button, Alert, CircularProgress 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token, user } = useSelector((state) => state.auth);
  const patientId = localStorage.getItem('patientId');
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log("Auth state:", { token: token?.substring(0, 10) + "...", user });
    console.log("Patient ID from localStorage:", patientId);
  }, [token, user, patientId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      // Check if patientId exists
      if (!patientId) {
        console.error("No patient ID found in localStorage");
        setError("Patient ID not found. Please try logging out and logging in again.");
        setLoading(false);
        return;
      }

      // Check if token exists
      if (!token) {
        console.error("No authentication token found");
        setError("Authentication token not found. Please try logging in again.");
        setLoading(false);
        return;
      }

      try {
        console.log("Making API calls to appointment service...");
        
        const [statsRes, appointmentsRes] = await Promise.all([
          axios.get(`http://localhost:8084/api/appointments/patient/${patientId}/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8084/api/appointments/patient/${patientId}/upcoming`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        console.log("API responses received:", {
          stats: statsRes.data,
          appointments: appointmentsRes.data
        });

        setStats(statsRes.data);
        setUpcomingAppointments(appointmentsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        // More detailed error logging
        if (error.response) {
          console.error('Response error:', {
            status: error.response.status,
            data: error.response.data
          });
          setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('Request error - no response received');
          setError("Could not connect to appointment service. Please ensure all services are running.");
        } else {
          console.error('Other error:', error.message);
          setError(`Error: ${error.message}`);
        }
        
        setLoading(false);
      }
    };

    fetchData();
  }, [token, patientId]);

  // If patient ID doesn't exist, try to fetch it
  useEffect(() => {
    const fetchPatientId = async () => {
      if (!patientId && token && user?.id) {
        try {
          console.log("Trying to fetch patient ID from user ID...");
          const response = await axios.get(
            `http://localhost:8082/api/patients/user/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (response.data && response.data.id) {
            console.log("Patient ID retrieved:", response.data.id);
            localStorage.setItem('patientId', response.data.id);
            window.location.reload(); // Reload to use the new patient ID
          }
        } catch (error) {
          console.error('Failed to fetch patient details:', error);
          setError("Could not retrieve patient information. Please try logging in again.");
        }
      }
    };
    
    fetchPatientId();
  }, [patientId, token, user?.id]);

  const StatCard = ({ title, value, color }) => (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: 140,
        bgcolor: color || 'primary.light',
        color: 'white'
      }}
    >
      <Typography component="h2" variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography component="p" variant="h4">
        {value}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading dashboard data...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Patient Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/patient/book-appointment')}
        >
          Book New Appointment
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button 
            color="inherit" 
            size="small" 
            sx={{ ml: 2 }} 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('patientId');
              navigate('/login');
            }}
          >
            Log In Again
          </Button>
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Upcoming Appointments"
            value={stats.upcomingAppointments}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Completed Appointments"
            value={stats.completedAppointments}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            {upcomingAppointments.length > 0 ? (
              <List>
                {upcomingAppointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem>
                      <ListItemText
                        primary={`Doctor: ${appointment.doctorName}`}
                        secondary={`Date: ${new Date(appointment.appointmentDateTime).toLocaleDateString()} | Time: ${new Date(appointment.appointmentDateTime).toLocaleTimeString()} | Status: ${appointment.status}`}
                      />
                    </ListItem>
                    {index < upcomingAppointments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                No upcoming appointments
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard;