const express = require('express');
const multer = require('multer');
const artistsController = require('../controllers/artists.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const router = express.Router();
const upload = multer();
const avatarUpload = require('../middleware/upload_avatar_middleware');
const { authJwtmiddleware, authorizeRoles} = require('../middleware/auth_middleware')
module.exports.setup = (app) => {
    app.use('/api/v1/artists', router);

    /**
     * @swagger
     * /api/v1/artists:
     *   get:
     *     summary: Get all artists
     *     description: Retrieve a list of all artists
     *     parameters:
     *       - in: query
     *         name: artist_name
     *         schema:
     *           type: string
     *         description: Filter by name
     *       - in: query
     *         name: country
     *         schema:
     *           type: string
     *         description: Filter by country
     *       - $ref: '#/components/parameters/limitParam'
     *       - $ref: '#/components/parameters/pageParam'
     *     tags:
     *       - artists
     *     responses:
     *       200:
     *         description: A list of artists
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
     *                     artists:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Artist'
     *                 metadata:
     *                   $ref: '#/components/schemas/PaginationMetadata'
     *       500:
     *         description: Server error (An error occurred while fetching artists)
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
     *                   example: "An error occurred while fetching artists"
     *                 data:
     *                   type: object
     *                   nullable: true
     */
    router.get('/', artistsController.getArtistsByFilter);


    /**
     * @swagger
     * /api/v1/artists:
     *   post:
     *     summary: Create a new artist
     *     description: Create a new artist with fields for artist name, bio, and country
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             $ref: '#/components/schemas/Artist'
     *     tags:
     *       - artists
     *     responses:
     *       201:
     *         description: A new artist created
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
     *                     artist:
     *                       $ref: '#/components/schemas/Artist'        
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
     *         description: Internal Server Error (An error occurred while creating the artist)
     */
    router.post('/',authorizeRoles([1]), avatarUpload, artistsController.createArtist);

    /**
     * @swagger
     * /api/v1/artists:
     *   delete:
     *     summary: Delete all artists
     *     description: Delete all artists from the system
     *     tags:
     *       - artists
     *     responses:
     *       200:
     *         description: All artists deleted
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
     *                   example: "An error occurred while removing all artists"
     */
    router.delete('/',authorizeRoles([1]), artistsController.deleteAllArtists);

    /**
     * @swagger
     * /api/v1/artists/{artist_id}:
     *   get:
     *     summary: Get artist by ID
     *     description: Retrieve a single artist by their ID
     *     parameters:
     *       - $ref: '#/components/parameters/artistIdParam' 
     *     tags:
     *       - artists
     *     responses:
     *       200:
     *         description: A single artist
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
     *                     artist:
     *                       $ref: '#/components/schemas/Artist'
     *       404:
     *         description: Artist not found
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
     *                   example: "Artist not found"
     *                 data:
     *                   type: object
     *                   nullable: true
     *       500:
     *         description: Server error while retrieving artist
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
     *                   example: "An error occurred while retrieving artist"
     */
    router.get('/:id', artistsController.getArtist);
    
    /**
     * @swagger
     * /api/v1/artists/{artist_id}/songs:
     *   get:
     *     summary: Get songs by artist ID
     *     description: Retrieve all songs associated with a specific artist ID
     *     parameters:
     *       - $ref: '#/components/parameters/artistIdParam'
     *     tags:
     *       - artists
     *     responses:
     *       200:
     *         description: A list of songs for the artist
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
     *                     songs:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Song'
     *       500:
     *         description: Server error while retrieving songs for the artist
     */
    router.get('/:artist_id/songs', artistsController.getSongsByArtistId);
    /**
     * @swagger
     * /api/v1/artists/{artist_id}:
     *   put:
     *     summary: Update artist by ID
     *     description: Update information of an artist by ID, including artist name, bio, and country
     *     parameters:
     *       - $ref: '#/components/parameters/artistIdParam' 
     *     tags:
     *       - artists
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               artist_name:
     *                 type: string
     *                 example: "Jane Doe"
     *               bio:
     *                 type: string
     *                 example: "An updated bio."
     *               country:
     *                 type: string
     *                 example: "Canada"
     *     responses:
     *       200:
     *         description: An updated artist
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
     *                     artist:
     *                       $ref: '#/components/schemas/Artist'
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
     *                   example: "Artist not found"
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
     *                   example: "Error updating artist with id 0"
     */
    router.put('/:id',authorizeRoles([1]), avatarUpload, artistsController.updateArtist);

    /**
     * @swagger
     * /api/v1/artists/{artist_id}:
     *   delete:
     *     summary: Delete artist by ID
     *     description: Delete an artist by ID
     *     parameters:
     *       - $ref: '#/components/parameters/artistIdParam' 
     *     tags:
     *       - artists
     *     responses:
     *       200:
     *         description: Artist deleted
     *         $ref: '#/components/responses/200NoData'
     *       404:
     *         description: Artist not found
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
     *                   example: "Artist not found"
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
     *                   example: "Could not delete artist with id 0"
     */
    router.delete('/:id',authorizeRoles([1]), artistsController.deleteArtist);

    
    // Handle unsupported HTTP methods
    router.all('/:id', methodNotAllowed);
};
