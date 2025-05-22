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
  const { token, user } = useSelector((state) => state.auth);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'doctorName',
      headerName: 'Doctor Name',
      width: 200,
      valueGetter: (params) => params.row.doctor?.name || 'N/A',
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueGetter: (params) => new Date(params.row.date).toLocaleDateString(),
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 150,
      valueGetter: (params) => new Date(params.row.time).toLocaleTimeString(),
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
      const response = await axios.get(`http://localhost:8084/api/appointments/patient/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      setError('Failed to fetch appointments');
    }
  }, [token, user.id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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
            rows={appointments}
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
                Doctor: Dr. {selectedAppointment?.doctor?.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Date: {new Date(selectedAppointment?.date).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Time: {new Date(selectedAppointment?.time).toLocaleTimeString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Reason: {selectedAppointment?.reason}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Symptoms: {selectedAppointment?.symptoms}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Status:{' '}
                <Chip
                  label={selectedAppointment?.status}
                  color={
                    selectedAppointment?.status === 'APPROVED'
                      ? 'success'
                      : selectedAppointment?.status === 'REJECTED'
                      ? 'error'
                      : 'warning'
                  }
                  size="small"
                />
              </Typography>
              {selectedAppointment?.notes && (
                <Typography variant="subtitle1" gutterBottom>
                  Doctor's Notes: {selectedAppointment.notes}
                </Typography>
              )}
              {selectedAppointment?.prescription && (
                <Typography variant="subtitle1" gutterBottom>
                  Prescription: {selectedAppointment.prescription}
                </Typography>
              )}
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