const genresService = require('../services/genre.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');

async function createGenre(req, res, next) {
  const { genre_name } = req.body;
  
  if (!req.body?.genre_name || typeof req.body.genre_name !== 'string') {
    return next(new ApiError(400, 'Genre should be a non-empty string'));
  }
  try {
    const existingGenre = await genresService.getGenreByName(req.body.genre_name);

    if (existingGenre) {
      return next(new ApiError(409, 'Genre already exists'));
    }

    const genre = await genresService.createGenre({
      ...req.body
    });

    return res
      .status(201)
      .set({ Location: `${req.baseUrl}/${genre.genre_id}` })
      .json(JSend.success({ genre }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while creating the genre'));
  }
}

async function getGenresByFilter(req, res, next) {
  let result = {
    genres: [],
    metadata: {
      totalReconds: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    }
  }

  try {
    result = await genresService.getManyGenres(req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while fetching genres'));
  }
  return res.json(
    JSend.success({
      genres: result.genres,
      metadata: result.metadata,
    })
  );
}

async function getGenre(req, res, next) {
  const { id } = req.params;
  console.log(req.params);
  try {
    const genre = await genresService.getGenreById(id);
    if (!genre) {
      return next(new ApiError(404, 'Genre not found'));
    }

    return res.json(JSend.success({ genre }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Error retrieving Genre with id=${id}`));
  }
}

async function updateGenre(req, res, next) {
  const { id } = req.params;
  const { genre_name } = req.body;

  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, 'Data for update cannot be empty'));
  }

  try {
    const existingGenre = await genresService.getGenreByName(req.body.genre_name, req.params.id);

    if (existingGenre) {
      return next(new ApiError(409, 'Genre already exists'));
    }
    const updatedGenre = await genresService.updateGenre(id, req.body);

    if (!updatedGenre) {
      return next(new ApiError(404, 'Genre not found'));
    }
    

    return res.json(JSend.success({ genre: updatedGenre }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Error updating Genre with id=${id}`));
  }
}

async function deleteGenre(req, res, next) {
  const { id } = req.params;

  try {
    const deletedGenre = await genresService.deleteGenre(id);

    if (!deletedGenre) {
      return next(new ApiError(404, 'Genre not found'));
    }

    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Could not delete Genre with id=${id}`));
  }
}

async function deleteAllGenres(req, res, next) {
  try {
    await genresService.deleteAllGenres();
    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while removing all Genres'));
  }
}

module.exports = {
    
  createGenre,
  getGenresByFilter,
  getGenre,
  updateGenre,
  deleteGenre,
  deleteAllGenres,
};
