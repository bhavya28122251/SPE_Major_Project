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
  Chip,
  Autocomplete,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const specialties = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Ophthalmology',
  'Psychiatry',
  'Gynecology',
  'ENT',
  'General Medicine',
];

function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialties: [],
    experience: '',
    qualification: '',
  });
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'fullName', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phoneNumber', headerName: 'Phone', width: 150 },
	{
	  field: 'specialties',
	  headerName: 'Specialties',
	  width: 300,
	  renderCell: (params) => (
	    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
	      {params.value?.map((specialty, index) => (
		<Chip
		  key={specialty.id || index}
		  label={specialty.name}
		  size="small"
		  sx={{ mr: 0.5, mb: 0.5 }}
		/>
	      ))}
	    </Box>
	  ),
	},
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

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8085/api/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (error) {
      setError('Failed to fetch doctors');
    }
  }, [token]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleOpen = () => {
    setOpen(true);
    setSelectedDoctor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      specialties: [],
      experience: '',
      qualification: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDoctor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      specialties: [],
      experience: '',
      qualification: '',
    });
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      address: doctor.address,
      specialties: doctor.specialties,
      experience: doctor.experience,
      qualification: doctor.qualification,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await axios.delete(`http://localhost:8085/api/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchDoctors();
      } catch (error) {
        setError('Failed to delete doctor');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDoctor) {
        await axios.put(
          `http://localhost:8085/api/doctors/${selectedDoctor.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post('http://localhost:8085/api/doctors', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleClose();
      fetchDoctors();
    } catch (error) {
      setError('Failed to save doctor');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Doctor Management
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Doctor
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={doctors}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
          />
        </div>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedDoctor ? 'Edit Doctor' : 'Add Doctor'}
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
                rows={2}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <Autocomplete
                multiple
                options={specialties}
                value={formData.specialties}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, specialties: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    required
                    fullWidth
                    label="Specialties"
                  />
                )}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Experience (years)"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={(e) =>
                  setFormData({ ...formData, qualification: e.target.value })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedDoctor ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default DoctorManagement; 
