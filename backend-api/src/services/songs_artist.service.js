const knex = require('../database/knex');

function songArtistsRepository() {
    return knex('song_artists');
}

function readSongArtist(payload) {
    return {
        song_id: payload.song_id,
        artist_id: payload.artist_id,
    };
}

async function createSongArtist(payload) {
    const songArtist = readSongArtist(payload);
    
    // Validate song_id and artist_id
    const songExists = await knex('songs').where('song_id', songArtist.song_id).first();
    if (!songExists) {
        throw new Error('Song not found');
    }

    const artistExists = await knex('Artists').where('artist_id', songArtist.artist_id).first();
    if (!artistExists) {
        throw new Error('Artist not found');
    }

    await songArtistsRepository().insert(songArtist);
    return songArtist;
}

async function getArtistsBySongId(song_id) {
    return songArtistsRepository()
        .where('song_id', song_id)
        .join('artists', 'song_artists.artist_id', '=', 'artists.artist_id')
        .select(
            'song_artists.song_id',
            'song_artists.artist_id',
            'artists.artist_name',
            'artists.bio'
        );
}

async function getSongsByArtistId(artist_id) {
    try {
        // Truy vấn danh sách các bài hát của nghệ sĩ từ cơ sở dữ liệu
        const songs = await songArtistsRepository()
            .where('artist_id', artist_id) // Lọc theo artist_id
            .join('songs', 'song_artists.song_id', '=', 'songs.song_id') // Kết hợp với bảng songs
            .select(
                'song_artists.artist_id',
                'song_artists.song_id',
                'songs.song_name',
                'songs.avatar',
                'songs.streaming_count',
                'songs.duration',
                'songs.sound',
            );
        
        return songs;  // Trả về danh sách các bài hát
    } catch (error) {
        console.error("Error fetching songs for artist:", error.message);
        throw error;  // Đảm bảo lỗi được ném ra nếu có lỗi xảy ra
    }
}


async function deleteSongArtist(song_id, artist_id) {
    const association = await songArtistsRepository()
        .where({ song_id, artist_id })
        .select('*')
        .first();

    if (!association) {
        return null;
    }

    await songArtistsRepository().where({ song_id, artist_id }).del();
    return association;
}

// 
async function deleteAllSongArtistsBySongId(song_id) {
    await songArtistsRepository().where('song_id', song_id).del();
}

async function deleteAllSongArtistsByArtistId(artist_id) {
    await songArtistsRepository().where('artist_id', artist_id).del();
}
async function deleteAllSongArtistsAssociation(artist_id) {
    await songArtistsRepository().del();
}

module.exports = {
    createSongArtist,
    getArtistsBySongId,
    getSongsByArtistId,
    deleteSongArtist,
    deleteAllSongArtistsBySongId,
    deleteAllSongArtistsByArtistId,
    deleteAllSongArtistsAssociation,
};
