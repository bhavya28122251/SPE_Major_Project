import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';

// Layout Components
import Layout from './components/layout/Layout';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import PatientManagement from './components/admin/PatientManagement';
import DoctorManagement from './components/admin/DoctorManagement';

// Doctor Components
import DoctorDashboard from './components/doctor/Dashboard';
import DoctorAppointments from './components/doctor/Appointments';
import DoctorProfile from './components/doctor/Profile';

// Patient Components
import PatientDashboard from './components/patient/Dashboard';
import BookAppointment from './components/patient/BookAppointment';
import PatientAppointments from './components/patient/Appointments';
import PatientProfile from './components/patient/Profile';
import DoctorList from './components/patient/DoctorList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const ProtectedRoute = ({ children, roles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/patients"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <PatientManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/doctors"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <DoctorManagement />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="doctor"
            element={
              <ProtectedRoute roles={['DOCTOR']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/appointments"
            element={
              <ProtectedRoute roles={['DOCTOR']}>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/profile"
            element={
              <ProtectedRoute roles={['DOCTOR']}>
                <DoctorProfile />
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="patient"
            element={
              <ProtectedRoute roles={['PATIENT']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="patient/book-appointment"
            element={
              <ProtectedRoute roles={['PATIENT']}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="patient/appointments"
            element={
              <ProtectedRoute roles={['PATIENT']}>
                <PatientAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="patient/profile"
            element={
              <ProtectedRoute roles={['PATIENT']}>
                <PatientProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="patient/doctors"
            element={
              <ProtectedRoute roles={['PATIENT']}>
                <DoctorList />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App; 