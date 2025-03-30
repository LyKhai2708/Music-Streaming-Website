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
const baseUrl = '/api/v1/songs';

async function fetchSongs(page, limit = 10) {
    const url = `${baseUrl}?page=${page}&limit=${limit}`;
    const data = await efetch(url);

    // Mapping songs to include genre_name and artist_names
    data.songs = data.songs.map((song) => {
        return {
            ...song,
            genre_name: song.genre_name || 'Unknown',
            artist_name: song.artist_name || 'Unknown',
        };
    });
    return data;
}

async function fetchSong(id) {
    const { song, artist } = await efetch(`${baseUrl}/${id}`);
    console.log(await efetch(`${baseUrl}/${id}`))
    const artistIds = Array.isArray(artist) ? artist.map(a => a.artist_id) : [];
    return {
        ...song,
        sound: song.sound,
        artist_ids: artistIds

    };
}

// Lấy danh sách nghệ sĩ theo ID bài hát
async function fetchArtistsBySongId(song_id) {
    const data = await efetch(`${baseUrl}/${song_id}/artists`);
    return data; // trả về danh sách nghệ sĩ
}

async function createSong(song) {
    return efetch(baseUrl, {
        method: 'POST',
        body: song,
    });
}

async function deleteAllSongs() {
    return efetch(baseUrl, {
        method: 'DELETE',
    });
}

async function updateSong(id, song) {
    return efetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: song,
    });
}

async function deleteSong(id) {
    return efetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
    });
}
async function updateStreamingCount(id, streaming_count) {
    return efetch(`${baseUrl}/${id}/streaming_count`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streaming_count })
    });
}
export default {
    fetchSongs,
    fetchSong,
    fetchArtistsBySongId,
    createSong,
    deleteAllSongs,
    updateSong,
    deleteSong,
    updateStreamingCount
}