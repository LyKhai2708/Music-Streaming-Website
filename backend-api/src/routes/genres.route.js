const express = require('express');
const genresController = require('../controllers/genre.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const router = express.Router();

module.exports.setup = (app) => {
    app.use('/api/v1/genres', router);

    /**
     * @swagger
     * /api/v1/genres:
     *   get:
     *     summary: Get Genres by filter
     *     description: Get Genres by filter
     *     parameters:
     *       - in: query
     *         name: genre_name
     *         schema:
     *           type: string
     *         description: Filter by genre name
     *       - $ref: '#/components/parameters/limitParam'
     *       - $ref: '#/components/parameters/pageParam'
     *     tags:
     *       - genres
     *     responses:
     *       200:
     *         description: A list of genres
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
     *                     genres:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Genre'
     *                 metadata:
     *                   $ref: '#/components/schemas/PaginationMetadata'
     *       500:
     *         description: Server error (An error occurred while fetching genres)
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
     *                   example: "An error occurred while fetching genres"
     *                 data:
     *                   type: object
     *                   nullable: true
     */
    router.get('/', genresController.getGenresByFilter);


    /**
     * @swagger
     * /api/v1/genres:
     *   post:
     *     summary: Create a new genre
     *     description: Create a new genre
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Genre'
     *     tags:
     *       - genres
     *     responses:
     *       201:
     *         description: A new genre created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Genre'
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
     *         description: Internal Server Error (An error occurred while creating the genre)
     */
    router.post('/', genresController.createGenre);

    /**
     * @swagger
     * /api/v1/genres/{id}:
     *   get:
     *     summary: Get genre by ID
     *     description: Retrieve a single genre by its ID
     *     parameters:
     *       - $ref: '#/components/parameters/genreIdParam'
     *     tags:
     *       - genres
     *     responses:
     *       200:
     *         description: A single genre
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
     *                     genre:
     *                       $ref: '#/components/schemas/Genre'
     *       404:
     *         description: Genre not found
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
     *                   example: "Genre not found"
     *                 data:
     *                   type: object
     *                   nullable: true
     *       500:
     *         description: Server error while retrieving genre
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
     *                   example: "An error occurred while retrieving genre"
     */
    router.get('/:id', genresController.getGenre);

    /**
     * @swagger
     * /api/v1/genres/{id}:
     *   put:
     *     summary: Update genre by ID
     *     description: Update information of a genre by ID
     *     parameters:
     *       - $ref: '#/components/parameters/genreIdParam'
     *     tags:
     *       - genres
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Genre'
     *     responses:
     *       200:
     *         description: An updated genre
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
     *                     genre:
     *                       $ref: '#/components/schemas/Genre'
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
     *         description: Genre not found
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
     *                   example: "Genre not found"
     *                 data:
     *                   type: object
     *                   nullable: true
     *       409:
     *         description: Genre with the same name already exists
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
     *                   example: "Genre already exists"
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
     *                   example: "Error updating genre with id 0"
     */
    router.put('/:id', genresController.updateGenre);

    /**
     * @swagger
     * /api/v1/genres/{id}:
     *   delete:
     *     summary: Delete genre by ID
     *     description: Delete a genre by ID
     *     parameters:
     *       - $ref: '#/components/parameters/genreIdParam'
     *     tags:
     *       - genres
     *     responses:
     *       200:
     *         description: Genre deleted
     *         $ref: '#/components/responses/200NoData'
     *       404:
     *         description: Genre not found
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
     *                   example: "Genre not found"
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
     *                   example: "Error deleting genre with id 0"
     */
    router.delete('/:id', genresController.deleteGenre);

    /**
     * @swagger
     * /api/v1/genres/:
     *   delete:
     *     summary: Delete all genre
     *     description: Delete all genre
     *     tags:
     *       - genres
     *     responses:
     *       200:
     *         description: All genre deleted
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
     *                   example: "An error occurred while removing all genres"
     */
    router.delete('/', genresController.deleteAllGenres)
    // Method not allowed
    router.all('/', methodNotAllowed);
    router.all('/:id', methodNotAllowed);
};
