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

const DoctorProfile = () => {
  const { token } = useSelector((state) => state.auth);
  const doctorId = localStorage.getItem('doctorId');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    licenseNumber: '',
    yearsOfExperience: '',
    specialties: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8083/api/doctors/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Map the API response to our state structure
        const doctorData = response.data;
        setProfile({
          fullName: doctorData.fullName || '',
          email: doctorData.email || '',
          phoneNumber: doctorData.phoneNumber || '',
          bio: doctorData.bio || '',
          licenseNumber: doctorData.licenseNumber || '',
          yearsOfExperience: doctorData.yearsOfExperience || '',
          specialties: doctorData.specialties || []
        });
      } catch (error) {
        setError('Failed to fetch profile');
        console.error('Error fetching doctor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token && doctorId) {
      fetchProfile();
    }
  }, [token, doctorId]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8083/api/doctors/${doctorId}`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Doctor Profile
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={profile.fullName}
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
                label="Phone Number"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience (years)"
                name="yearsOfExperience"
                type="number"
                value={profile.yearsOfExperience}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="License Number"
                name="licenseNumber"
                value={profile.licenseNumber}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                multiline
                rows={4}
                value={profile.bio}
                onChange={handleChange}
                disabled={!isEditing}
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

export default DoctorProfile;