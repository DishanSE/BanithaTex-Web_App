const dotenv = require('dotenv');
const db = require('./config/db');
const app = require('./app');

// Load environment variables
dotenv.config();

// Port configuration
const PORT = process.env.PORT;

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});
