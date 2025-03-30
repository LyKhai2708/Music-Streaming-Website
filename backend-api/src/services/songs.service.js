const knex = require('../database/knex');
const Paginator = require('./paginator');
const fs = require('fs');
const path = require('path');
const projectRoot = path.resolve(__dirname, '..', '..');

function songRepository() {
    return knex('songs');
}

function readSong(payload) {
    return {
        song_name: payload.song_name,
        duration: payload.duration,
        genre_id: payload.genre_id,
        release_date: payload.release_date,
        streaming_count: payload.streaming_count,
        sound: payload.sound,
        avatar: payload.avatar || null,
    };
}

// Tạo mới một bài hát
async function createSong(payload) {
    const song = readSong(payload);
    const [song_id] = await songRepository().insert(song);
    return { song_id, ...song };
}

// Lấy nhiều bài hát dựa trên điều kiện lọc
async function getManySongs(query) {
    const { song_name, genre_id, page = 1, limit = 5 } = query;
    const paginator = new Paginator(page, limit);

    let results = await songRepository()
        .where((builder) => {
            if (song_name) {
                builder.where('song_name', 'like', `%${song_name}%`);
            }
            if (genre_id) {
                builder.where('songs.genre_id', genre_id);
            }
        })
        .select(
            knex.raw('count(songs.song_id) OVER() AS recordCount'),
            'songs.song_id',
            'songs.song_name',
            'songs.duration',
            'songs.genre_id',
            'songs.release_date',
            'songs.streaming_count',
            'songs.sound',
            'songs.avatar',
            'genres.genre_name AS genre_name',
            knex.raw('GROUP_CONCAT(artists.artist_name SEPARATOR ", ") AS artist_name')
        )
        .limit(paginator.limit)
        .offset(paginator.offset)
        .leftJoin('genres', 'genres.genre_id', 'songs.genre_id')
        .leftJoin('song_artists', 'songs.song_id', 'song_artists.song_id')
        .leftJoin('artists', 'artists.artist_id', 'song_artists.artist_id')
        .groupBy('songs.song_id');

    let totalRecords = results.length > 0 ? results[0].recordCount : 0;
    results = results.map((result) => {
        delete result.recordCount;
        return result;
    });

    return {
        metadata: paginator.getMetadata(totalRecords),
        songs: results,
    };
}

// Lấy bài hát theo ID
async function getSongById(id) {
    const result = await songRepository()
        .where('songs.song_id', id)
        .select(
            'songs.song_id',
            'songs.song_name',
            'songs.duration',
            'songs.genre_id',
            'songs.release_date',
            'songs.streaming_count',
            'songs.sound',
            'songs.avatar',
            'genres.genre_name AS genre_name',
            knex.raw('GROUP_CONCAT(artists.artist_name SEPARATOR ", ") AS artist_name')
        )
        .leftJoin('genres', 'genres.genre_id', 'songs.genre_id')
        .leftJoin('song_artists', 'songs.song_id', 'song_artists.song_id')
        .leftJoin('artists', 'artists.artist_id', 'song_artists.artist_id')
        .groupBy('songs.song_id')
        .first();

    return result;
}

// Lấy danh sách nghệ sĩ theo ID bài hát
async function getArtistsBySongId(song_id) {
    return knex('song_artists')
        .where('song_id', song_id)
        .join('artists', 'song_artists.artist_id', '=', 'artists.artist_id')
        .select('song_artists.song_id', 'song_artists.artist_id', 'artists.artist_name');
}

// Cập nhật bài hát
async function updateSong(id, payload) {
    const existingSong = await songRepository().where('song_id', id).select('*').first();
    if (!existingSong) {
        return null;
    }
    const updatedSong = readSong(payload);
    await songRepository().where('song_id', id).update(updatedSong);
    return { ...existingSong, ...updatedSong };
}

// Xóa bài hát
async function deleteSong(id) {
    const song = await songRepository().where('song_id', id).select('*').first();
    if (!song) {
        return null;
    }

    if (song.avatar) {



        const avatarPath = path.join(projectRoot, song.avatar);
        

        try {
            fs.unlinkSync(avatarPath);
            console.log(`Đã xóa avatar của bài hát ${id}`);
        } catch (err) {
            console.error(`Không thể xóa avatar cho bài hát ${id}:`, err);
        }
    }
    if (song.sound) {

        const soundPath = path.join(projectRoot, song.sound);
        

        try {
            fs.unlinkSync(soundPath);
            console.log(`Đã xóa sound của bài hát ${id}`);
        } catch (err) {
            console.error(`Không thể xóa sound cho bài hát ${id}:`, err);
        }
    }

    await songRepository().where('song_id', id).del();
    return song;
}

// Xóa tất cả bài hát
async function deleteAllSongs() {
    const songs = await songRepository().select('avatar', 'sound');
    for (const song of songs) {
        if (song.avatar) {
            const avatarPath = path.join(projectRoot, song.avatar);
            try {
                fs.unlinkSync(avatarPath);
            } catch (err) {
                console.error(`Không thể xóa avatar:`, err);
            }
        }
        if (song.sound) {
            const soundPath = path.join(projectRoot, song.sound);
            try {
                fs.unlinkSync(soundPath);
            } catch (err) {
                console.error(`Không thể xóa sound:`, err);
            }
        }
    }
    await songRepository().del();
}
// songs.services.js
async function updateStreamingCount(id, newCount) {
    const existingSong = await songRepository().where('song_id', id).select('*').first();
    if (!existingSong) {
        return null;
    }

    // Cập nhật giá trị streaming_count
    console.log(existingSong)
    await songRepository().where('song_id', id).update({ streaming_count: newCount });
    return { ...existingSong, streaming_count: newCount };
}

module.exports = {
    createSong,
    getManySongs,
    getSongById,
    updateSong,
    deleteSong,
    deleteAllSongs,
    getArtistsBySongId,
    updateStreamingCount
};
