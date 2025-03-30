const knex = require('../database/knex');
const Paginator = require('./paginator');
const path = require('path');
const fs = require('fs');
const projectRoot = path.resolve(__dirname, '..', '..');
function artistRepository() {
    return knex('Artists');
}

// Function to read artist data from payload and return an object suitable for insertion/update
function readArtist(payload) {
    return {
        artist_name: payload.artist_name,
        bio: payload.bio,
        country: payload.country,
        avatar: payload.avatar || null
    };
}

// Create a new artist in the 'Artists' table
async function createArtist(payload) {
    const artist = readArtist(payload);
    const [artist_id] = await artistRepository().insert(artist);
    return { artist_id, ...artist };
}

// Get multiple artists based on filter criteria
async function getManyArtists(query) {
    const { artist_name, country, page = 1, limit = 5 } = query;
    const paginator = new Paginator(page, limit);
    let results = await artistRepository()
        .where((builder) => {
            if (artist_name) {
                builder.where('artist_name', 'like', `%${artist_name}%`);
            }
            if (country) {
                builder.where('country', 'like', `%${country}%`);
            }
        })
        .select(
            knex.raw('count(artist_id) OVER() AS recordCount'),
            'artist_id',
            'artist_name',
            'bio',
            'country',
            'avatar'
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
        artists: results,
    };
}
// Get a single artist by ID
async function getArtistById(id) {
    return artistRepository()
        .where('artist_id', id)
        .select(
            'artist_id',
            'artist_name',
            'bio',
            'country',
            'avatar'
        )
        .first();
}

// Get songs by artist ID
async function getSongsByArtistId(artist_id) {
    return knex('song_artists')
        .where('artist_id', artist_id)
        .join('songs', 'song_artists.song_id', '=', 'songs.song_id')
        .select('song_artists.artist_id', 'song_artists.song_id', 'songs.song_name');
}

// Update an existing artist
async function updateArtist(id, payload) {
    const existingArtist = await artistRepository().where('artist_id', id).select('*').first();
    if (!existingArtist) {
        return null;
    }

    const updatedArtist = readArtist(payload);
    await artistRepository().where('artist_id', id).update(updatedArtist);

    return { ...existingArtist, ...updatedArtist };
}

// Delete an artist by ID
async function deleteArtist(id) {
    const artist = await artistRepository().where('artist_id', id).select('*').first();
    if (!artist) {
        return null;
    }
    if (artist.avatar && artist.avatar != 'public/images/OIP.jpg') {

        
        const avatarPath = path.join(projectRoot, artist.avatar);

        try {
            fs.unlinkSync(avatarPath); // Xóa file avatar
            console.log(`Đã xóa avatar của artist ${id}`);
        } catch (err) {
            console.error(`Không thể xóa avatar cho artist ${id}:`, err);
        }
    }
    await artistRepository().where('artist_id', id).del();
    return artist;
}

// Delete all artists
async function deleteAllArtists() {
    const artists = await artistRepository().select('avatar');
    for (const artist of artists) {
        if (artist.avatar && artist.avatar != 'public/images/OIP.jpg') {
            const avatarPath = path.join(projectRoot, artist.avatar);
            try {
                fs.unlinkSync(avatarPath); // Xóa file avatar
            } catch (err) {
                console.error(`Không thể xóa avatar:`, err);
            }
        }
    }
    await artistRepository().del();
}

module.exports = {
    createArtist,
    getManyArtists,
    getArtistById,
    updateArtist,
    deleteArtist,
    deleteAllArtists,
    getSongsByArtistId,
};
