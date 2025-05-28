import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useSelector } from 'react-redux';

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
    prescription: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const doctorId = localStorage.getItem('doctorId');


    // Process appointments to add row numbers
  const appointmentsWithRowNumbers = appointments.map((appointment, index) => ({
    ...appointment,
    rowNumber: index + 1
  }));

  const columns = [
    {
    field: 'rowNumber', 
    headerName: '#', 
    width: 90,
    },
    // { 
    //   field: 'id', 
    //   headerName: 'ID', 
    //   width: 90, 
    //   hide: true 
    // },
    {
      field: 'patientName',
      headerName: 'Patient Name',
      width: 200,
      valueGetter: (params) => params.row.patientName || 'N/A',
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueGetter: (params) => new Date(params.row.appointmentDateTime).toLocaleDateString(),
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 150,
      valueGetter: (params) => new Date(params.row.appointmentDateTime).toLocaleTimeString(),
    },
    {
      field: 'reason',
      headerName: 'Reason',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'APPROVED'
              ? 'success'
              : params.value === 'REJECTED'
              ? 'error'
              : 'warning'
          }
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          {params.row.status === 'PENDING' && (
            <>
              <Button
                size="small"
                color="success"
                onClick={() => handleStatusChange(params.row.id, 'APPROVED')}
                sx={{ mr: 1 }}
              >
                Approve
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleStatusChange(params.row.id, 'REJECTED')}
              >
                Reject
              </Button>
            </>
          )}
          {params.row.status === 'APPROVED' && (
            <Button
              size="small"
              color="primary"
              onClick={() => handleViewDetails(params.row)}
            >
              Add Notes
            </Button>
          )}
        </Box>
      ),
    },
  ];

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8084/api/appointments/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      setError('Failed to fetch appointments');
    }
  }, [token, doctorId]); // Added doctorId here

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      await axios.put(
        `http://localhost:8084/api/appointments/${appointmentId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAppointments();
      setSuccess(`Appointment ${status.toLowerCase()} successfully`);
    } catch (error) {
      setError('Failed to update appointment status');
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      notes: appointment.notes || '',
      prescription: appointment.prescription || '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
    setFormData({
      notes: '',
      prescription: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8084/api/appointments/${selectedAppointment.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAppointments();
      handleClose();
      setSuccess('Appointment notes updated successfully');
    } catch (error) {
      setError('Failed to update appointment notes');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          My Appointments
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

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={appointmentsWithRowNumbers}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Patient: {selectedAppointment?.patientName || 'N/A'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Date: {new Date(selectedAppointment?.appointmentDateTime).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Time: {new Date(selectedAppointment?.appointmentDateTime).toLocaleTimeString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Reason: {selectedAppointment?.reason}
              </Typography>
              <TextField
                margin="normal"
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
              <TextField
                margin="normal"
                fullWidth
                label="Prescription"
                name="prescription"
                multiline
                rows={4}
                value={formData.prescription}
                onChange={(e) =>
                  setFormData({ ...formData, prescription: e.target.value })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default DoctorAppointments;