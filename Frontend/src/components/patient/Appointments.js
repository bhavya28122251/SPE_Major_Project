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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useSelector } from 'react-redux';

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const patientId = localStorage.getItem('patientId');

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
    //   hide: true  // Hide the database ID column
    // },
    {
      field: 'doctorName',
      headerName: 'Doctor Name',
      width: 200,
      valueGetter: (params) => params.row?.doctorName || 'N/A',
    },
    {
      field: 'appointmentDateTime',
      headerName: 'Date',
      width: 150,
      valueGetter: (params) => new Date(params.row?.appointmentDateTime).toLocaleDateString(),
    },
    {
      field: 'appointmentDateTime',
      headerName: 'Time',
      width: 150,
      valueGetter: (params) => new Date(params.row?.appointmentDateTime).toLocaleTimeString(),
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
            params.value === 'SCHEDULED'
              ? 'success'
              : params.value === 'CANCELLED'
              ? 'error'
              : 'warning'
          }
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          size="small"
          color="primary"
          onClick={() => handleViewDetails(params.row)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8084/api/appointments/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      setError('Failed to fetch appointments');
    }
  }, [token, patientId]);

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    }
  }, [fetchAppointments, patientId]);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
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
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Doctor: {selectedAppointment?.doctorName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Date: {selectedAppointment?.appointmentDateTime ? new Date(selectedAppointment.appointmentDateTime).toLocaleDateString() : ''}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Time: {selectedAppointment?.appointmentDateTime ? new Date(selectedAppointment.appointmentDateTime).toLocaleTimeString() : ''}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Reason: {selectedAppointment?.reason}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Notes: {selectedAppointment?.notes || 'No notes available'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Status:{' '}
                <Chip
                  label={selectedAppointment?.status}
                  color={
                    selectedAppointment?.status === 'SCHEDULED'
                      ? 'success'
                      : selectedAppointment?.status === 'CANCELLED'
                      ? 'error'
                      : 'warning'
                  }
                  size="small"
                />
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default PatientAppointments;