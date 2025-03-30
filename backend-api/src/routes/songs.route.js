const express = require('express');
const multer = require('multer');
const songsController = require('../controllers/songs.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const router = express.Router();
const upload = multer();
const uploadFile = require('../middleware/upload_file_mw.js');
const { authJwtmiddleware, authorizeRoles} = require('../middleware/auth_middleware')
module.exports.setup = (app) => {
    app.use('/api/v1/songs', router);

    /**
     * @swagger
     * /api/v1/songs:
     *   get:
     *     summary: Get all songs
     *     description: Retrieve a list of all songs
     *     parameters:
     *       - in: query
     *         name: song_name
     *         schema:
     *           type: string
     *         description: Filter by song name
     *       - in: query
     *         name: genre_id
     *         schema:
     *           type: integer
     *         description: Filter by genre
     *       - $ref: '#/components/parameters/limitParam'
     *       - $ref: '#/components/parameters/pageParam'
     *     tags:
     *       - songs
     *     responses:
     *       200:
     *         description: A list of songs
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
     *                 metadata:
     *                   $ref: '#/components/schemas/PaginationMetadata'
     *       500:
     *         description: Server error (An error occurred while fetching songs)
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
     *                   example: "An error occurred while fetching songs"
     */
    router.get('/', songsController.getManySongs);


    /**
     * @swagger
     * /api/v1/songs:
     *   post:
     *     summary: Create a new song
     *     description: Create a new song with fields for song name, duration, album, genre, release date, and streaming count
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *              $ref: '#/components/schemas/Song'
     *     tags:
     *       - songs
     *     responses:
     *       201:
     *         description: A new song created
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
     *                     song:
     *                       $ref: '#/components/schemas/Song'
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
     *       500:
     *         description: Internal Server Error (An error occurred while creating the song)
     */
    router.post('/',authorizeRoles([1]),uploadFile, songsController.createSong);

    /**
     * @swagger
     * /api/v1/songs/{song_id}:
     *   get:
     *     summary: Get song by ID
     *     description: Retrieve a single song by its ID
     *     parameters:
     *       - $ref: '#/components/parameters/songIdParam'
     *     tags:
     *       - songs
     *     responses:
     *       200:
     *         description: A single song
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
     *                     song:
     *                       $ref: '#/components/schemas/Song'
     *       404:
     *         description: Song not found
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
     *                   example: "Song not found"
     *       500:
     *         description: Server error while retrieving song
     */
    router.get('/:id', songsController.getSongById);

    /**
     * @swagger
     * /api/v1/songs/{song_id}:
     *   put:
     *     summary: Update song by ID
     *     description: Update information of a song by its ID, including album and genre
     *     parameters:
     *       - $ref: '#/components/parameters/songIdParam'
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               song_name:
     *                 type: string
     *                 example: "Updated Song Name"
     *               genre_id:
     *                 type: interger
     *                 example: "Updated Genres"
     *     tags:
     *       - songs
     *     responses:
     *       200:
     *         description: An updated song
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
     *                     song:
     *                       $ref: '#/components/schemas/Song'
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
     *                   example: "Invalid request data"
     *       404:
     *         description: Song not found
     *       500:
     *         description: Server error while updating song
     */
    router.put('/:id',authorizeRoles([1]),uploadFile, songsController.updateSong);

    /**
     * @swagger
     * /api/v1/songs/{song_id}:
     *   delete:
     *     summary: Delete song by ID
     *     description: Delete a single song by its ID
     *     parameters:
     *       - $ref: '#/components/parameters/songIdParam'
     *     tags:
     *       - songs
     *     responses:
     *       200:
     *         description: Song deleted
     *         $ref: '#/components/responses/200NoData'
     *       404:
     *         description: Song not found
     *       500:
     *         description: Server error while deleting song
     */
    router.delete('/:id',authorizeRoles([1]), songsController.deleteSong);

    /**
     * @swagger
     * /api/v1/songs:
     *   delete:
     *     summary: Delete all songs
     *     description: Delete all songs from the system
     *     tags:
     *       - songs
     *     responses:
     *       200:
     *         description: All songs deleted
     *         $ref: '#/components/responses/200NoData'
     *       500:
     *         description: Server error while deleting all songs
     */
    router.delete('/',authorizeRoles([1]), songsController.deleteAllSongs);
    
    /**
     * @swagger
     * /api/v1/songs/{song_id}/artists:
     *   get:
     *     summary: Get artists by song ID
     *     description: Retrieve a list of artists associated with a specific song by its ID
     *     parameters:
     *       - $ref: '#/components/parameters/songIdParam'
     *     tags:
     *       - songs
     *     responses:
     *       200:
     *         description: A list of artists for the song
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
     *       500:
     *         description: Server error while fetching artists for the song
     */
    router.get('/:song_id/artists', songsController.getArtistsBySongId);

    router.put('/:id/streaming_count', authorizeRoles([0]), songsController.updateStreamingCount);

    router.all('/', methodNotAllowed);
    router.all('/:id', methodNotAllowed);
};