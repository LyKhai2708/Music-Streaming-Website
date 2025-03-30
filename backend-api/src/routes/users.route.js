const express = require('express');
const multer = require('multer');
const usersController = require('../controllers/users.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const router = express.Router();
const upload = multer();
const avatarUpload = require('../middleware/upload_avatar_middleware');
const { authJwtmiddleware, authorizeRoles} = require('../middleware/auth_middleware')
module.exports.setup = (app) => {
    app.use('/api/v1/users', router);

    /**
     * @swagger
     * /api/v1/users:
     *   get:
     *     summary: Get all users
     *     description: Retrieve a list of all users
     *     parameters:
     *       - in: query
     *         name: username
     *         schema:
     *           type: string
     *         description: Filter by username
     *       - in: query
     *         name: email
     *         schema:
     *           type: string
     *         description: Filter by email
     *       - $ref: '#/components/parameters/limitParam'
     *       - $ref: '#/components/parameters/pageParam'
     *     tags:
     *       - users
     *     responses:
     *       200:
     *         description: A list of users
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: [success]
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/User'
     *                 metadata:
     *                   $ref: '#/components/schemas/PaginationMetadata'
     *       500:
     *         description: Server error (An error occurred while fetching users)
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
     *                   example: "An error occurred while fetching users"
     *                 data:
     *                   type: object
     *                   nullable: true
     */
    router.get('/', usersController.getUsersByFilter);

    /**
     * @swagger
     * /api/v1/users:
     *   post:
     *     summary: Create a new user
     *     description: Create a new user with fields for username, email, password, full name, and optional avatar
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *              type: object
     *              properties:
     *               username:
     *                 type: string
     *                 example: "john_doe_updated"
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "john@example.com"
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "password"
     *               full_name:
     *                 type: string
     *                 example: "John Doe Updated"
     *               confirmpass:
     *                 type: string
     *                 format: password
     *                 description: Confirm Password
     *               avatarFile:
     *                 type: string
     *                 format: binary
     *                 description: User avatar file
     *     tags:
     *       - users
     *     responses:
     *       201:
     *         description: A new user created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'        
     *       400:
     *         description: Bad request (Validation failed)
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
     *                   example: "Invalid request data"
     *                 data:
     *                   type: object
     *                   nullable: true
     *       500:
     *         description: Internal Server Error (An error occurred while creating the user)
     */
    router.post('/', avatarUpload, usersController.createUser);

    /**
     * @swagger
     * /api/v1/users:
     *   delete:
     *     summary: Delete all users
     *     description: Delete all users from the system
     *     tags:
     *       - users
     *     responses:
     *       200:
     *         description: All users deleted
     *         $ref: '#/components/responses/200NoData'
     *       500:
     *         description: Internal Server Error
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
     *                   example: "An error occurred while removing all users"
     */
    router.delete('/',authorizeRoles([1]), usersController.deleteAllUsers);

    /**
     * @swagger
     * /api/v1/users/{id}:
     *   get:
     *     summary: Get user by ID
     *     description: Retrieve a single user by their ID
     *     parameters:
     *       - $ref: '#/components/parameters/userIdParam' 
     *     tags:
     *       - users
     *     responses:
     *       200:
     *         description: A single user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *       404:
     *         description: User not found
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
     *                   example: "User not found"
     *                 data:
     *                   type: object
     *                   nullable: true
     *       500:
     *         description: Server error while retrieving user
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
     *                   example: "An error occurred while retrieving user"
     */
    router.get('/:id', usersController.getUser);

    /**
     * @swagger
     * /api/v1/users/{id}:
     *   put:
     *     summary: Update user by ID
     *     description: Update information of a user by ID, including username, email, password, full name, and optional avatar
     *     parameters:
     *       - $ref: '#/components/parameters/userIdParam' 
     *     tags:
     *       - users
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 example: "john_doe_updated"
     *               email:
     *                 type: string
     *                 example: "john_updated@example.com"
     *               full_name:
     *                 type: string
     *                 example: "John Doe Updated"
     *               avatar:
     *                 type: string
     *                 example: "avatar_url_updated.jpg"
     *     responses:
     *       200:
     *         description: An updated user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request
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
     *                   example: "Data for update cannot be empty"
     *                 data:
     *                   type: object
     *                   nullable: true
     *       404:
     *         description: Not Found
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
     *                   example: "User not found"
     *                 data:
     *                   type: object
     *                   nullable: true
     *       500:
     *         description: Internal Server Error
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
     *                   example: "Error updating user with id 0"
     */
    router.put('/:id', avatarUpload, usersController.updateUser);

    /**
     * @swagger
     * /api/v1/users/{id}:
     *   delete:
     *     summary: Delete user by ID
     *     description: Delete a user by ID
     *     parameters:
     *       - $ref: '#/components/parameters/userIdParam' 
     *     tags:
     *       - users
     *     responses:
     *       200:
     *         description: User deleted
     *         $ref: '#/components/responses/200NoData'
     *       404:
     *         description: User not found
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
     *                   example: "User not found"
     *       500:
     *         description: Internal Server Error
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
     *                   example: "Could not delete user with id 0"
     */
    router.delete('/:id',authorizeRoles([1]), usersController.deleteUser);
    

    /**
     * @swagger
     * /api/v1/users/{id}/password:
     *   put:
     *     summary: Change user's password by ID
     *     description: Change the password of a user by their ID. Requires old password and new password.
     *     parameters:
     *       - $ref: '#/components/parameters/userIdParam' 
     *     tags:
     *       - users
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               oldPassword:
     *                 type: string
     *                 example: "current_password123"
     *               newPassword:
     *                 type: string
     *                 example: "new_password123"
     *     responses:
     *       200:
     *         description: Password updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request, either old password or new password is missing
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
     *                   example: "Old password and new password are required"
     *                 data:
     *                   type: object
     *                   nullable: true
     *       404:
     *         description: User not found
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
     *                   example: "User not found"
     *                 data:
     *                   type: object
     *                   nullable: true
     *       500:
     *         description: Internal Server Error
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
     *                   example: "Error updating password for user with id 0"
     */

    router.put('/:id/password',authorizeRoles([0]), usersController.updatePassword);
    // Handle unsupported HTTP methods
    router.all('/:id', methodNotAllowed);
};
