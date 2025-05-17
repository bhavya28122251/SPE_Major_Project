# Patient Management System

A microservices-based Patient Management System built with Spring Boot and React.

## Architecture

The system consists of the following microservices:

1. **API Gateway** - Entry point for all client requests
2. **Service Registry** - Eureka server for service discovery
3. **Config Server** - Centralized configuration management
4. **Patient Service** - Manages patient-related operations
5. **Doctor Service** - Manages doctor-related operations
6. **Appointment Service** - Handles appointment scheduling and management
7. **Auth Service** - Handles authentication and authorization using JWT

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.3
- Spring Cloud 2023.0.0
- Spring Security
- MySQL 8.0
- JWT for authentication
- OpenAPI/Swagger for API documentation
- Maven for dependency management

### Frontend
- React.js
- Material-UI
- Axios for API calls
- React Router for navigation
- Redux for state management

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Setup Instructions

1. Clone the repository
2. Start MySQL server
3. Start the services in the following order:
   - Config Server
   - Service Registry
   - API Gateway
   - Auth Service
   - Patient Service
   - Doctor Service
   - Appointment Service
4. Start the React frontend

## Service Ports

- Config Server: 8888
- Service Registry: 8761
- API Gateway: 8080
- Auth Service: 8081
- Patient Service: 8082
- Doctor Service: 8083
- Appointment Service: 8084
- Frontend: 3000

## Features

### Admin
- CRUD operations for patients
- CRUD operations for doctors
- View all appointments
- Manage system settings

### Doctor
- View and manage appointments
- Update availability
- View patient details
- Update profile

### Patient
- Book appointments
- View available doctors
- View doctor specialties
- View appointment history
- Update profile

## API Documentation

Once the services are running, you can access the Swagger documentation at:
- API Gateway: http://localhost:8080/swagger-ui.html
- Individual Services: http://localhost:{port}/swagger-ui/index.html#/

## Security

- JWT-based authentication
- Role-based access control
- Secure password hashing
- HTTPS support

## Database Schema

The system uses separate databases for each service:
- patient_db
- doctor_db
- appointment_db
- auth_db

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 