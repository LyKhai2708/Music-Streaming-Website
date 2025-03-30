const express = require('express');
const multer = require('multer');
const authController = require('../controllers/auth.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const router = express.Router();
const upload = multer();
module.exports.setup = (app) => {
    app.use('/api/v1/', router);
    /**
     * @swagger
     * /api/v1/login:
     *   post:
     *     summary: User login to get JWT token
     *     description: This endpoint allows a user to log in using their email and password and get a JWT token for future authenticated requests.
     *     tags:
     *       - auth
     *     requestBody:
     *       description: User credentials (email and password) required for login
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: "user@example.com"
     *               password:
     *                 type: string
     *                 example: "password123"
     *     responses:
     *       200:
     *         description: Successful login, returns user details and JWT token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *                       example: 1
     *                     email:
     *                       type: string
     *                       example: "user@example.com"
     *                 token:
     *                   type: string
     *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     *       400:
     *         description: Invalid email or password
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: [fail]
     *                 message:
     *                   type: string
     *                   description: A human-readable error message
     *                   example: "Email not found"
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: [error]
     *                 message:
     *                   type: string
     *                   description: A human-readable error message
     *                   example: "An error occurred while logging"
     */
router.post('/login', authController.login);
};