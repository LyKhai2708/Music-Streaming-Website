const songsService = require('../services/songs.service');
const genresService = require('../services/genre.service');
const artistsService = require('../services/artists.service')
const songArtistsService = require('../services/songs_artist.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');


async function createSong(req, res, next) {
    let { song_name, genre_id, duration , release_date, streaming_count, artist_id} = req.body;
    console.log(artist_id)
    if (!song_name || typeof song_name !== 'string') {
        return next(new ApiError(400, 'Song name should be a non-empty string'));
    }
    const avatarFile = req.files['avatarFile'] ? req.files['avatarFile'][0] : null;
    const soundFile = req.files['soundFile'] ? req.files['soundFile'][0] : null;

    if (!soundFile) {
        return next(new ApiError(400, 'SoundFile is required'));
    }
    try {
        if (genre_id) {
            const genreExists = await genresService.getGenreById(genre_id);
            if (!genreExists) {
                return next(new ApiError(404, 'Genre not found'));
            }
        }
        const song = await songsService.createSong({
            ...req.body,
            sound: `/public/sounds/${soundFile.filename}`,
            avatar: avatarFile ? `/public/images/${avatarFile.filename}` : null
        });

        
        if (artist_id && Array.isArray(artist_id)) {
            
            for (const id of artist_id) {
                    const artistExists = await artistsService.getArtistById(id);
                if (!artistExists) {
                    
                    return next(new ApiError(404, 'Artist not found'));
                }
                await songArtistsService.createSongArtist({
                    song_id: song.song_id,
                    artist_id: id 
                });
            }
        }


//         if (artist_id) {
//             const artistExists = await songArtistsService.createSongArtist({
//                 song_id: song.song_id,
//                 artist_id
//             });
//             if (!artistExists) {
//                 return next(new ApiError(404, 'Artist not found'));
//             }
//         }

        return res
            .status(201)
            .set({ Location: `${req.baseUrl}/${song.song_id}` })
            .json(JSend.success({ song }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while creating the song'));
    }
}

async function getManySongs(req, res, next) {
    let result = {
        songs: [],
        metadata: {
            totalReconds: 0,
            firstPage: 1,
            lastPage: 1,
            page: 1,
            limit: 5,
        }
    }

    try {
        result = await songsService.getManySongs(req.query);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while fetching songs'));
    }
    return res.json(
        JSend.success({
        songs: result.songs,
        metadata: result.metadata,
        })
    );
}

async function getSongById(req, res, next) {
    const { id } = req.params;
    try {
        const song = await songsService.getSongById(id);

        if (!song) {
            return next(new ApiError(404, 'Song not found'));
        }
        const artists = await songArtistsService.getArtistsBySongId(id);
        return res.json(JSend.success({ song, artists }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error retrieving song with id=${id}`));
    }
}

async function updateSong(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Data for update cannot be empty'));
    }
    const { id } = req.params;
    const { genre_id, artist_id } = req.body;
    if (!req.files['soundFile']) {
        return next(new ApiError(400, 'SoundFile is required'));
    }
    try {
        if (genre_id) {
            const genreExists = await genresService.getGenreById(genre_id);
            if (!genreExists) {
                return next(new ApiError(404, 'Genre not found'));
            }
        }
        
        const updatedSong = await songsService.updateSong(id, {
            
            ...req.body,
            avatar: req.files ? `/public/images/${req.files['avatarFile'][0].filename}` : null,
            sound: req.files ? `/public/sounds/${req.files['soundFile'][0].filename}` : null,
            });
            console.log(req.files['avatarFile'][0].filename)


        if (!updatedSong) {
            return next(new ApiError(404, 'Song not found'));
        }
        if (artist_id && Array.isArray(artist_id)) {
            for (const aid of artist_id) {
                if((await songArtistsService.getArtistsBySongId(id)).length === 0){
                    const artistExists = await artistsService.getArtistById(aid);

                if (!artistExists) {
                    return next(new ApiError(404, 'Artist not found'));
                }
                await songArtistsService.createSongArtist({
                    song_id: updatedSong.song_id,
                    artist_id: aid 
                });

                }
            }
        }

        return res.json(JSend.success({ song: updatedSong }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error updating song with id=${id}`));
    }
}

async function deleteSong(req, res, next) {
    const { id } = req.params;
    console.log(id);
    try {
        console.log(await songArtistsService.getArtistsBySongId(id));
        if((await (songArtistsService.getArtistsBySongId(id))).length != 0){
            await songArtistsService.deleteAllSongArtistsBySongId(id);
        }
        
        const deletedSong = await songsService.deleteSong(id);

        if (!deletedSong) {
            return next(new ApiError(404, 'Song not found'));
        }
        
        return res.json(JSend.success());
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Could not delete song with id=${id}`));
    }
}

// Delete all songs
async function deleteAllSongs(req, res, next) {
    try {
        await songsService.deleteAllSongs();
        await songArtistsService.deleteAllSongArtistsAssociation();
        return res.json(JSend.success());
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while removing all songs'));
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
// songs.controller.js
async function updateStreamingCount(req, res, next) {
    const { id } = req.params;
    const { streaming_count } = req.body;
    // Kiểm tra xem có truyền vào streaming_count không
    if (streaming_count === undefined || streaming_count < 0) {
        return next(new ApiError(400, 'Invalid streaming count'));
    }

    try {
        // Cập nhật streaming_count
        const updatedSong = await songsService.updateStreamingCount(id, streaming_count);
        if (!updatedSong) {
            return next(new ApiError(404, 'Song not found'));
        }

        return res.json(JSend.success({ song: updatedSong }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error updating streaming count for song with id=${id}`));
    }
}

module.exports = {
    createSong,
    getManySongs,
    getSongById,
    updateSong,
    deleteSong,
    deleteAllSongs,
    getArtistsBySongId,
    updateStreamingCount,
};