import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';

function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'address', headerName: 'Address', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

const fetchPatients = useCallback(async () => {
  try {
    const response = await axios.get('http://localhost:8082/api/patients', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const formattedPatients = response.data.map((patient) => ({
      ...patient,
      name: `${patient.firstName} ${patient.lastName}`,
      phone: patient.phoneNumber, // mapping backend field to match DataGrid
    }));

    setPatients(formattedPatients);
  } catch (error) {
    setError('Failed to fetch patients');
  }
}, [token]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleOpen = () => {
    setOpen(true);
    setSelectedPatient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPatient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`http://localhost:8082/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPatients();
      } catch (error) {
        setError('Failed to delete patient');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPatient) {
        await axios.put(
          `http://localhost:8082/api/patients/${selectedPatient.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post('http://localhost:8082/api/patients', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleClose();
      fetchPatients();
    } catch (error) {
      setError('Failed to save patient');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Patients
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={patients}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
          />
        </div>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {selectedPatient ? 'Edit Patient' : 'Add Patient'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedPatient ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default PatientManagement; 
