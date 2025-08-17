Patient Management System Setup and Execution Instructions

This document provides step-by-step instructions for installing and running the Patient Management System application.

**I. Prerequisites**

Before proceeding, ensure you have the following installed on your system:

1.  **Node.js and npm (Node Package Manager):**
    * Download and install Node.js from [nodejs.org](https://nodejs.org/). npm is included with Node.js.
2.  **MongoDB:**
    * Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community).
    * Ensure MongoDB is running.
3.  **A code editor:**
    * Visual Studio Code, Sublime Text, or any other preferred code editor.

**II. Backend Setup**

1.  **Extract the ZIP file:**
    * Extract the contents of `PatientManagementSystem.zip` to a directory of your choice.
2.  **Navigate to the backend directory:**
    * Open your terminal or command prompt and navigate to the `backend` directory:
        ```bash
        cd PatientManagementSystem/backend
        ```
3.  **Install backend dependencies:**
    * Run the following command to install the required npm packages:
        ```bash
        npm install
        ```
4.  **Configure environment variables:**
    * Create a file named `.env` in the `backend` directory.
    * Add the following variables to the `.env` file, replacing the placeholder values with your actual configuration:
        ```
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        PORT=5000
        ```
        * `MONGODB_URI`: The connection string for your MongoDB database. Example: `mongodb://127.0.0.1:27017/patient_management`.
        * `JWT_SECRET`: A secret key used for JSON Web Token (JWT) authentication. Choose a strong, random string.
        * `PORT`: The port on which the backend server will run.
5.  **Start the backend server:**
    * Run the following command to start the backend server:
        ```bash
        npm start
        ```
    * Alternatively, to use nodemon for automatic restarts on file changes, use:
        ```bash
        npm run dev
        ```
    * The server should start running on the specified port (default: 5000).

**III. Frontend Setup**

1.  **Navigate to the frontend directory:**
    * Open a new terminal or command prompt and navigate to the `frontend` directory:
        ```bash
        cd PatientManagementSystem/frontend
        ```
2.  **Install frontend dependencies:**
    * Run the following command to install the required npm packages:
        ```bash
        npm install
        ```
3.  **Configure environment variables:**
    * Create a file named `.env` in the `frontend` directory.
    * Add the following variable to the `.env` file:
        ```
        REACT_APP_API_URL=http://localhost:5000/api
        ```
    * This variable specifies the URL of the backend API.
4.  **Start the frontend application:**
    * Run the following command to start the React development server:
        ```bash
        npm start
        ```
    * The application should open in your default web browser at `http://localhost:3000`.

**IV. Accessing the Application**

1.  **Open your web browser:**
    * If the application didn't open automatically, open your web browser and navigate to `http://localhost:3000`.
2.  **Login:**
    * Use the provided login credentials to access the application. If no user has been created, use postman or a similar program to create a user in the backend /users/register endpoint.
3.  **Use the application:**
    * You can now use the Patient Management System to manage patients, appointments, and billing.

**V. Troubleshooting**

* **Backend server not running:**
    * Check the terminal for any error messages.
    * Ensure MongoDB is running.
    * Verify the `MONGODB_URI` in the `.env` file.
* **Frontend application not loading:**
    * Check the browser's developer console for any JavaScript errors.
    * Ensure the backend server is running and accessible.
    * Verify the `REACT_APP_API_URL` variable in the frontend `.env` file.
* **API requests failing:**
    * Check the browser's network tab in the developer console for API request errors.
    * Verify the backend server is running and the API endpoints are correctly configured.
    * Verify your JWT_SECRET is the same in both the frontend and backend.
* **MongoDB connection errors:**
    * Verify the Mongodb service is running.
    * Verify that the Mongodb uri is correct.