const knex = require('../database/knex');
const Paginator = require('./paginator');
// Repository function to access the 'Users' table
function genresRepository() {
    return knex('genres');
}

// Function to read user data from payload and return an object suitable for insertion/update
function readGenre(payload) {
    return {
        genre_name: payload.genre_name,
    };
}

// Create a new user in the 'Users' table
async function createGenre(payload) {
    const Genre = readGenre(payload);
    const [genre_id] = await genresRepository().insert(Genre);
    return { genre_id, ...Genre };
}

async function getGenreByName(genre_name, genre_id = null) {
  const query = genresRepository()
    .whereRaw('LOWER(genre_name) = LOWER(?)', [genre_name]);
  
  if (genre_id) {
    query.andWhere('genre_id', '!=', genre_id);
  }

  return query.first();
}
// Get multiple users based on filter criteria
async function getManyGenres(query) {
    const { genre_name, page = 1, limit = 5  } = query;
    const paginator = new Paginator(page, limit);
    let results = await genresRepository()
        .where((builder) => {
            if (genre_name) {
                builder.where('genre_name', 'like', `%${genre_name}%`);
            }
        })
        .select(
            knex.raw('count(genre_id) OVER() AS recordCount'),
            'genre_id',
            'genre_name'
        )
        .limit(paginator.limit)
        .offset(paginator.offset);
    let totalRecords = 0;
    results = results.map((result) => {
        totalRecords = result.recordCount;
        delete result.recordCount;
        return result;
    });
    return {       
        metadata: paginator.getMetadata(totalRecords),
        genres: results,
    };
}

// Get a single user by ID
async function getGenreById(id) {
    return genresRepository().where('genre_id', id).select('*').first();
}

// Update an existing user
async function updateGenre(id, payload) {
    const existingGenre = await genresRepository().where('genre_id', id).select('*').first();
    if (!existingGenre) {
        return null;
    }

    const updatedGenre = readGenre(payload);
    await genresRepository().where('genre_id', id).update(updatedGenre);
    
    return { ...existingGenre, ...updatedGenre };
}

// Delete a user by ID
async function deleteGenre(id) {
    const genre = await genresRepository().where('genre_id', id).select('*').first();
    if (!genre) {
        return null;
    }

    await genresRepository().where('genre_id', id).del();
    return genre;
}

//Delete all users
async function deleteAllGenres() {
    await genresRepository().del();
}

module.exports = {
    getGenreByName,
    createGenre,
    getManyGenres,
    getGenreById,
    updateGenre,
    deleteGenre,
    deleteAllGenres,
};