const artistsService = require('../services/artists.service');
const songArtistsService = require('../services/songs_artist.service');
const songsService = require('../services/songs.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');

// Create a new artist
async function createArtist(req, res, next) {
    const { artist_name, bio, country } = req.body;
    console.log(req.body)
    if (!artist_name || typeof artist_name !== 'string') {
        return next(new ApiError(400, 'Artist name should be a non-empty string'));
    }

    try {
        const artist = await artistsService.createArtist({
            artist_name,
            bio, 
            country,
            avatar: req.file ? `/public/images/${req.file.filename}` : '/public/images/OIP.jpg'
        });

        return res
            .status(201)
            .set({ Location: `${req.baseUrl}/${artist.artist_id}` })
            .json(JSend.success({ artist }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while creating the artist'));
    }
}
async function getArtistsByFilter(req, res, next) {
    let result = {
        artists: [],
        metadata: {
            totalReconds: 0,
            firstPage: 1,
            lastPage: 1,
            page: 1,
            limit: 5,
        }
    }
    try {
        result = await artistsService.getManyArtists(req.query);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while fetching artists'));
    }
    return res.json(
        JSend.success({
        artists: result.artists,
        metadata: result.metadata,
        })
    );
}

// Get artist by ID
async function getArtist(req, res, next) {
    const { id } = req.params;
    try {
        const artist = await artistsService.getArtistById(id);

        if (!artist) {
            return next(new ApiError(404, 'Artist not found'));
        }

        return res.json(JSend.success({ artist }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error retrieving artist with id=${id}`));
    }
}

// Update artist by ID
async function updateArtist(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Data for update cannot be empty'));
    }
    const { id } = req.params;

    try {
        const updatedArtist = await artistsService.updateArtist(id, {
            ...req.body,
            avatar: req.file ? `/public/images/${req.file.filename}` : null,
            });

        if (!updatedArtist) {
            return next(new ApiError(404, 'Artist not found'));
        }

        return res.json(JSend.success({ artist: updatedArtist }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error updating artist with id=${id}`));
    }
}

async function deleteArtist(req, res, next) {
    const { id } = req.params;
    try {
        await songArtistsService.deleteAllSongArtistsByArtistId(id);
        const songs = await songArtistsService.getSongsByArtistId(id);
        for (let song of songs) {
            const artistCount = await songArtistsService.getArtistsBySongId(song.song_id);
            if (!artistCount) {
                await songsService.deleteSong(song.song_id); // xóa bài nếu không còn nghệ sĩ nào liên kết => còn thì mới giữ lại 
            }
        }
        const deletedArtist = await artistsService.deleteArtist(id);

        if (!deletedArtist) {
            return next(new ApiError(404, 'Artist not found'));
        }

        return res.json(JSend.success());
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Could not delete artist with id=${id}`));
    }
}

// Delete all artists
async function deleteAllArtists(req, res, next) {
    try {
        await songArtistsService.deleteAllSongArtistsAssociation(); // xóa toàn bộ liên hệ

        await songsService.deleteAllSongs();  // xóa toàn bộ nhạc

        await artistsService.deleteAllArtists(); // xóa hết ca sĩ 
        return res.json(JSend.success());
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while removing all artists'));
    }
}
async function getSongsByArtistId(req, res, next) {
    const { artist_id } = req.params;

    try {
        const songs = await songArtistsService.getSongsByArtistId(artist_id);
        return res.json(JSend.success({ songs }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while fetching songs for this artist'));
    }
}

module.exports = {
    createArtist,
    getArtistsByFilter,
    getArtist,
    updateArtist,
    deleteArtist,
    deleteAllArtists,
    getSongsByArtistId,
};
