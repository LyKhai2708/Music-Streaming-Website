const express = require('express');
const songArtistsController = require('../controllers/songs_artists.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const router = express.Router();
const { authJwtmiddleware, authorizeRoles} = require('../middleware/auth_middleware')
module.exports.setup = (app) => {
    app.use('/api/v1/song_artists', router);

    /**
     * @swagger
     * /api/v1/song_artists:
     *   post:
     *     summary: Create a new song-artist association
     *     description: Create a new association between a song and an artist
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               song_id:
     *                 type: integer
     *                 example: 1
     *               artist_id:
     *                 type: integer
     *                 example: 1
     *     tags:
     *       - song_artists
     *     responses:
     *       201:
     *         description: A new song-artist association created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     songArtist:
     *                       type: object
     *                       properties:
     *                         song_id:
     *                           type: integer
     *                         artist_id:
     *                           type: integer
     *       400:
     *         description: Bad request (Validation failed)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [fail]
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *                   nullable: true
     *       404:
     *         description: Song or Artist not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [fail]
     *                 message:
     *                   type: string
     *       500:
     *         description: Server error (An error occurred while creating the association)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [error]
     *                 message:
     *                   type: string
     */
    router.post('/',authorizeRoles([1]), songArtistsController.createSongArtist);

    /**
     * @swagger
     * /api/v1/song_artists/song/{song_id}:
     *   get:
     *     summary: Get artists by song ID
     *     description: Retrieve all artists associated with a specific song
     *     parameters:
     *       - $ref: '#/components/parameters/songIdParam'
     *     tags:
     *       - song_artists
     *     responses:
     *       200:
     *         description: A list of artists associated with the song
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     artists:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           artist_id:
     *                             type: integer
     *                           artist_name:
     *                             type: string
     *       404:
     *         description: Song not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [fail]
     *                 message:
     *                   type: string
     *       500:
     *         description: Server error (An error occurred while fetching artists)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [error]
     *                 message:
     *                   type: string
     */
    router.get('/song/:song_id', songArtistsController.getArtistsBySongId);

    /**
     * @swagger
     * /api/v1/song_artists/artist/{artist_id}:
     *   get:
     *     summary: Get songs by artist ID
     *     description: Retrieve all songs associated with a specific artist
     *     parameters:
     *       - $ref: '#/components/parameters/artistIdParam'
     *     tags:
     *       - song_artists
     *     responses:
     *       200:
     *         description: A list of songs associated with the artist
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     songs:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           song_id:
     *                             type: integer
     *                           song_name:
     *                             type: string
     *       404:
     *         description: Artist not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [fail]
     *                 message:
     *                   type: string
     *       500:
     *         description: Server error (An error occurred while fetching songs)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [error]
     *                 message:
     *                   type: string
     */
    router.get('/artist/:artist_id', songArtistsController.getSongsByArtistId);


    /**
     * @swagger
     * /api/v1/song_artists/song/{song_id}:
     *   delete:
     *     summary: Delete all associations by song ID
     *     description: Remove all artist associations for a specific song
     *     parameters:
     *       - $ref: '#/components/parameters/songIdParam'
     *     tags:
     *       - song_artists
     *     responses:
     *       200:
     *         description: All associations deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     deletedAssociations:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           song_id:
     *                             type: integer
     *                           artist_id:
     *                             type: integer
     *       404:
     *         description: No associations found for the song
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [fail]
     *                 message:
     *                   type: string
     *       500:
     *         description: Server error (An error occurred while deleting associations)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [error]
     *                 message:
     *                   type: string
     */
    router.delete('/song/:song_id',authorizeRoles([1]), songArtistsController.deleteAllSongArtistsBySongId);
    /**
     * @swagger
     * /api/v1/song_artists/artist/{artist_id}:
     *   delete:
     *     summary: Delete all associations by artist ID
     *     description: Remove all song associations for a specific artist
     *     parameters:
     *       - $ref: '#/components/parameters/artistIdParam'
     *     tags:
     *       - song_artists
     *     responses:
     *       200:
     *         description: All associations deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     message:
     *                       type: string
     *       404:
     *         description: No associations found for the artist
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [fail]
     *                 message:
     *                   type: string
     *       500:
     *         description: Server error (An error occurred while deleting associations)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [error]
     *                 message:
     *                   type: string
     */
    router.delete('/artist/:artist_id', songArtistsController.deleteAllSongArtistsByArtistId);
    /**
     * @swagger
     * /api/v1/song_artists/{song_id}/{artist_id}:
     *   delete:
     *     summary: Delete a song-artist association
     *     description: Remove the association between a specific song and artist
     *     parameters:
     *       - $ref: '#/components/parameters/songIdParam'
     *       - $ref: '#/components/parameters/artistIdParam'
     *     tags:
     *       - song_artists
     *     responses:
     *       200:
     *         description: Association deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     deletedAssociation:
     *                       type: object
     *                       properties:
     *                         song_id:
     *                           type: integer
     *                         artist_id:
     *                           type: integer
     *       404:
     *         description: Association not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [fail]
     *                 message:
     *                   type: string
     *       500:
     *         description: Server error (An error occurred while deleting the association)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [error]
     *                 message:
     *                   type: string
     */
    router.delete('/:song_id/:artist_id', songArtistsController.deleteSongArtist);

    // Handle non-allowed methods
    router.all('*', methodNotAllowed);
};
