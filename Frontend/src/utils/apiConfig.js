import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
    },
    // Doctor endpoints
    DOCTOR: {
        BASE: '/doctors',
        COUNT: '/doctors/count',
        BY_ID: (id) => `/doctors/${id}`,
        BY_USER_ID: (userId) => `/doctors/user/${userId}`,
        BY_SPECIALTY: (specialtyId) => `/doctors/specialty/${specialtyId}`,
    },
    // Patient endpoints
    PATIENT: {
        BASE: '/patients',
        COUNT: '/patients/count',
        BY_ID: (id) => `/patients/${id}`,
        BY_USER_ID: (userId) => `/patients/user/${userId}`,
    },
    // Appointment endpoints
    APPOINTMENT: {
        BASE: '/appointments',
        STATS: '/appointments/stats',
        BY_ID: (id) => `/appointments/${id}`,
        BY_DOCTOR: (doctorId) => `/appointments/doctor/${doctorId}`,
        BY_PATIENT: (patientId) => `/appointments/patient/${patientId}`,
    },
};

export default api; 