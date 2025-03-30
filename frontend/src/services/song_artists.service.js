// song_artists.service.js (Frontend)

async function efetch(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`, // Thêm token vào headers
    };

    let result = {};
    let json = {};
    try {
        result = await fetch(url, { ...options, headers });
        json = await result.json();
    } catch (error) {
        throw new Error(error.message);
    }
    if (!result.ok || json.status !== 'success') {
        throw new Error(json.message);
    }
    return json.data;
}

const baseUrl = '/api/v1/song_artists'; // API endpoint cho song_artists

// Thêm một mối quan hệ giữa bài hát và nghệ sĩ
async function createSongArtist(song_id, artist_id) {
    const data = await efetch(baseUrl, {
        method: 'POST',
        body: JSON.stringify({ song_id, artist_id }),
        headers: { 'Content-Type': 'application/json' }
    });
    return data;
}

// Lấy danh sách nghệ sĩ của một bài hát
async function getArtistsBySongId(song_id) {
    const data = await efetch(`${baseUrl}/song/${song_id}`);
    return data;
}

// Lấy danh sách bài hát của một nghệ sĩ
async function getSongsByArtistId(artist_id) {
    const data = await efetch(`${baseUrl}/artist/${artist_id}`);
    return data;
}

// Xóa mối quan hệ giữa bài hát và nghệ sĩ
async function deleteSongArtist(song_id, artist_id) {
    const data = await efetch(`${baseUrl}/${song_id}/${artist_id}`, {
        method: 'DELETE',
    });
    return data;
}

// Xóa tất cả các nghệ sĩ của một bài hát
async function deleteAllSongArtistsBySongId(song_id) {
    const data = await efetch(`${baseUrl}/song/${song_id}`, {
        method: 'DELETE',
    });
    return data;
}

// Xóa tất cả các bài hát của một nghệ sĩ
async function deleteAllSongArtistsByArtistId(artist_id) {
    const data = await efetch(`${baseUrl}/artist/${artist_id}`, {
        method: 'DELETE',
    });
    return data;
}

export default {
    createSongArtist,
    getArtistsBySongId,
    getSongsByArtistId,
    deleteSongArtist,
    deleteAllSongArtistsBySongId,
    deleteAllSongArtistsByArtistId,
};
