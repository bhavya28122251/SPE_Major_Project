import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Fetch token from local storage
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    } else {
      const fetchStats = async () => {
        try {
          const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
            axios.get('http://localhost:8082/api/patients/count', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:8083/api/doctors/count', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:8084/api/appointments/stats', {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);

          setStats({
            totalPatients: patientsRes.data,
            totalDoctors: doctorsRes.data,
            totalAppointments: appointmentsRes.data.total,
            pendingAppointments: appointmentsRes.data.pending
          });
        } catch (error) {
          console.log('Error fetching stats:', error);
        }
      };

      fetchStats();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    navigate('/login'); // Redirect to login
  };

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Doctors"
            value={stats.totalDoctors}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Appointments"
            value={stats.pendingAppointments}
            color="#9c27b0"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;