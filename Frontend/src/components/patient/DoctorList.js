import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8083/api/doctors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(response.data);
      } catch (error) {
        setError('Failed to fetch doctors');
      }
    };

    fetchDoctors();
  }, [token]);

const filteredDoctors = doctors.filter(doctor => {
  // Convert search term to lowercase once
  const searchLower = searchTerm.toLowerCase();
  
  // Check if name exists and contains the search term
  const nameMatch = doctor.name ? 
    doctor.name.toLowerCase().includes(searchLower) : 
    false;
  
  // Check for specialization - could be named differently or an array
  let specializationMatch = false;
  
  // Check direct specialization field
  if (doctor.specialization) {
    specializationMatch = doctor.specialization.toLowerCase().includes(searchLower);
  }
  // Check for specialties array (commonly used format)
  else if (doctor.specialties && Array.isArray(doctor.specialties)) {
    specializationMatch = doctor.specialties.some(specialty => {
      // Check if specialty is a string or an object
      if (typeof specialty === 'string') {
        return specialty.toLowerCase().includes(searchLower);
      } else if (specialty && specialty.name) {
        return specialty.name.toLowerCase().includes(searchLower);
      }
      return false;
    });
  }
  
  return nameMatch || specializationMatch;
});

  const handleBookAppointment = (doctorId) => {
    navigate(`/patient/book-appointment/${doctorId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Doctors
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search doctors by name or specialization"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>
      <Grid container spacing={3}>
        {filteredDoctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {doctor.fullName}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {doctor.qualification}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={doctor.specialization}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`${doctor.yearsOfExperience} years experience`}
                    color="secondary"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {doctor.contactNumber}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleBookAppointment(doctor.id)}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DoctorList; 