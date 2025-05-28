import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';

const PatientProfile = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // First, try to get patientId from localStorage
        let patientId = localStorage.getItem('patientId');
        
        // If patientId is not in localStorage, fetch it using userId
        if (!patientId) {
          const patientResponse = await axios.get(
            `http://localhost:8082/api/patients/user/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          patientId = patientResponse.data.id;
          // Save patientId to localStorage for future use
          localStorage.setItem('patientId', patientId);
        }
        
        // Now fetch complete patient profile using patientId
        const profileResponse = await axios.get(
          `http://localhost:8082/api/patients/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setProfile(profileResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient profile:', error);
        setError('Failed to load patient profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, user.id]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let patientId = localStorage.getItem('patientId');

      await axios.put(`http://localhost:8082/api/patients/${patientId}`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile');
    }
  };
    if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Patient Profile
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default PatientProfile; 