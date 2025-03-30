const songArtistsService = require('../services/songs_artist.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');

async function createSongArtist(req, res, next) {
    const { song_id, artist_id } = req.body;

    if (!song_id || !artist_id) {
        return next(new ApiError(400, 'Song ID and Artist ID must be provided'));
    }

    try {
        const songArtist = await songArtistsService.createSongArtist({
            song_id,
            artist_id,
        });
        
        return res
            .status(201)
            .set({ Location: `${req.baseUrl}/${songArtist.song_id}/${songArtist.artist_id}` })
            .json(JSend.success({ songArtist }));
    } catch (error) {
        console.log(error);
        if (error.message === 'Song not found' || error.message === 'Artist not found') {
            return next(new ApiError(404, error.message));
        }
        return next(new ApiError(500, 'An error occurred while creating the song-artist association'));
    }
}


async function getArtistsBySongId(req, res, next) {
    const { song_id } = req.params;

    try {
        const artists = await songArtistsService.getArtistsBySongId(song_id);
        return res.json(JSend.success({ artists }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while fetching artists for this song'));
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

async function deleteSongArtist(req, res, next) {
    const { song_id, artist_id } = req.params;
    console.log(req.params);
    try {
        const deletedAssociation = await songArtistsService.deleteSongArtist(song_id, artist_id);

        if (!deletedAssociation) {
            return next(new ApiError(404, 'Song-artist association not found'));
        }

        return res.json(JSend.success({ deletedAssociation }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Could not delete association between song ${song_id} and artist ${artist_id}`));
    }
}

async function deleteAllSongArtistsBySongId(req, res, next) {
    const { song_id } = req.params;
   
    try {
        await songArtistsService.deleteAllSongArtistsBySongId(song_id);
        return res.json(JSend.success({ message: 'All associations for this song have been deleted' }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Could not delete associations for song ID ${song_id}`));
    }
}

async function deleteAllSongArtistsByArtistId(req, res, next) {
    const { artist_id } = req.params;

    try {
        await songArtistsService.deleteAllSongArtistsByArtistId(artist_id);
        return res.json(JSend.success({ message: 'All associations for this artist have been deleted' }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Could not delete associations for artist ID ${artist_id}`));
    }
}

module.exports = {
    createSongArtist,
    getArtistsBySongId,
    getSongsByArtistId,
    deleteSongArtist,
    deleteAllSongArtistsBySongId,
    deleteAllSongArtistsByArtistId,
};
