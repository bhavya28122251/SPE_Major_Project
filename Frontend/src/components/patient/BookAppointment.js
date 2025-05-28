import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useSelector } from 'react-redux';

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDateTime: null,
    reason: '',
    notes: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8083/api/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(response.data);
    } catch (error) {
      setError('Failed to fetch doctors');
    }
  }, [token]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDoctor(null);
    setFormData({
      appointmentDateTime: null,
      reason: '',
      symptoms: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const patientId = localStorage.getItem('patientId');
      const appointmentData = {
        patientId: patientId,
        doctorId: selectedDoctor.id,
        appointmentDateTime: formData.appointmentDateTime,
        reason: formData.reason,
        notes: formData.notes,
        status: 'PENDING',
      };

      await axios.post('http://localhost:8084/api/appointments', appointmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Appointment booked successfully');
      handleClose();
    } catch (error) {
      setError('Failed to book appointment');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Book an Appointment
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {doctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {doctor.fullName}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {doctor.qualification}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Experience: {doctor.yearsOfExperience} years
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {doctor.specialties.map((specialty, index) => (
                      <Chip
                        key={index}
                        label={specialty.name}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        title={specialty.description}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    Book Appointment
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            Book Appointment with Dr. {selectedDoctor?.fullName}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <DateTimePicker
                      label="Appointment Date and Time"
                      value={formData.appointmentDateTime}
                      onChange={(newValue) => {
                        setFormData({ ...formData, appointmentDateTime: newValue });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth margin="normal" />
                      )}
                      minDateTime={new Date()}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Reason for Visit"
                name="reason"
                multiline
                rows={2}
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Notes/Symptoms"
                name="Notes/Symptoms"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Book Appointment
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default BookAppointment;