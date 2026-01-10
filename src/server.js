/**
 * AtmoSphere API Server
 *
 * Express server with weather data aggregation.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || (NODE_ENV === 'production' ? false : true),
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        maxAge: 86400,
    })
);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
    });
});

// 404 handler
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'API endpoint not found',
        path: req.originalUrl,
    });
});

// Global error handler
app.use((err, req, res, _next) => {
    console.error('Server error:', err.message);

    res.status(err.status || 500).json({
        error: err.name || 'Internal Server Error',
        message:
            process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`AtmoSphere API running on port ${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    });
}

module.exports = app;
