import axios from 'axios';

export const getErrorMessage = (error) => {
    if (axios.isAxiosError(error)) {
        // Handle Axios error
        if (error.response) {
            // Server responded with error
            const status = error.response.status;
            const message = error.response.data?.message;

            switch (status) {
                case 400:
                    return message || 'Invalid request. Please check your input.';
                case 401:
                    return 'Authentication failed. Please log in again.';
                case 403:
                    return 'You do not have permission to perform this action.';
                case 404:
                    return message || 'Resource not found.';
                case 409:
                    return message || 'A conflict occurred with existing data.';
                case 500:
                    return 'An internal server error occurred. Please try again later.';
                default:
                    return message || 'An unexpected error occurred.';
            }
        } else if (error.request) {
            // Request made but no response
            return 'Unable to connect to the server. Please check your internet connection.';
        }
    }
    
    // Handle non-Axios errors
    return error.message || 'An unexpected error occurred.';
};

export const handleApiError = async (error, logout) => {
    const errorMessage = getErrorMessage(error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
        if (logout) {
            await logout();
        }
    }
    
    return errorMessage;
}; 