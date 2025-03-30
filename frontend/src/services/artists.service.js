

import { DEFAULT_AVATAR } from "@/constants";


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


const baseUrl = '/api/v1/artists'; // API endpoint cho nghệ sĩ

// Lấy danh sách nghệ sĩ với phân trang và lọc
// async function fetchArtists(page, limit = 500, artist_name = '', country = '') {
//     const url = `${baseUrl}?page=${page}&limit=${limit}&artist_name=${artist_name}&country=${country}`;
//     const data = await efetch(url);

//     // Mapping artists để thêm tên nghệ sĩ
//     data.artists = data.artists.map((artist) => ({
//         ...artist,
//         artist_name: artist.artist_name || 'Unknown',
//     }));

//     return data;
// }

// // Lấy thông tin nghệ sĩ theo ID
// async function fetchArtist(id) {
//     const { artist } = await efetch(`${baseUrl}/${id}`);
//     return { ...artist };
// }

// // Tạo nghệ sĩ mới
// async function createArtist(artist) {
//     return efetch(baseUrl, {
//         method: 'POST',
//         body: JSON.stringify(artist),
//         headers: { 'Content-Type': 'application/json' }
//     });
// }
async function fetchSongByArtistsId(artist_id) {
    const data = await efetch(`${baseUrl}/${artist_id}/songs`);
    return data; // trả về danh sách nghệ sĩ
}
// // Cập nhật thông tin nghệ sĩ
// async function updateArtist(id, artist) {
//     return efetch(`${baseUrl}/${id}`, {
//         method: 'PUT',
//         body: JSON.stringify(artist),
//         headers: { 'Content-Type': 'application/json' }
//     });
// }

// Xóa nghệ sĩ theo ID


async function fetchArtists(page, limit) {
    const url = `${baseUrl}?page=${page}&limit=${limit}`;
    const data = await efetch(url);
    data.artists = data.artists.map((artist) => {
        return {
            ...artist,
            avatar: artist.avatar ?? DEFAULT_AVATAR
        };
    });
    return data;
}
async function fetchArtist(id) {
    const { artist } = await efetch(`${baseUrl}/${id}`);
    return {
      ...artist,
      avatar: artist.avatar ?? DEFAULT_AVATAR
    };
}
async function createArtist(Artist) {
    return efetch(baseUrl, {
        method: 'POST',
        body: Artist,
    });
}
async function deleteAllArtists() {
    return efetch(baseUrl, {
        method: 'DELETE',
    });
}
async function updateArtist(id, Artist) {
    return efetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: Artist,
    });
}

async function deleteArtist(id) {
    return efetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
    });
}


export default {
    fetchArtists,
    fetchArtist,
    fetchSongByArtistsId,
    createArtist,
    updateArtist,
    deleteArtist,
    deleteAllArtists,
};

// export default {
//     fetchArtists,
//     fetchArtist,
//     createArtist,
//     deleteAllArtists,
//     updateArtist,
//     deleteArtist
// }

