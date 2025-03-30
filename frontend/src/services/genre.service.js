// genre.service.js (Frontend)

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

const baseUrl = '/api/v1/genres'; // API endpoint cho thể loại

// Lấy danh sách thể loại với phân trang và lọc
async function fetchGenres(page, limit = 500, genre_name = '') {
    const url = `${baseUrl}?page=${page}&limit=${limit}&genre_name=${genre_name}`;
    const data = await efetch(url);

    // Mapping genres để thêm tên thể loại
    data.genres = data.genres.map((genre) => ({
        ...genre,
        genre_name: genre.genre_name || 'Unknown',
    }));

    return data;
}

// Lấy thông tin thể loại theo ID
async function fetchGenre(id) {
    const { genre } = await efetch(`${baseUrl}/${id}`);
    return { ...genre };
}

// Tạo thể loại mới
async function createGenre(genre) {
    return efetch(baseUrl, {
        method: 'POST',
        body: JSON.stringify(genre),
        headers: { 'Content-Type': 'application/json' }
    });
}

// Cập nhật thông tin thể loại
async function updateGenre(id, genre) {
    return efetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(genre),
        headers: { 'Content-Type': 'application/json' }
    });
}

// Xóa thể loại theo ID
async function deleteGenre(id) {
    return efetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
    });
}

// Xóa tất cả thể loại
async function deleteAllGenres() {
    return efetch(baseUrl, {
        method: 'DELETE',
    });
}

export default {
    fetchGenres,
    fetchGenre,
    createGenre,
    updateGenre,
    deleteGenre,
    deleteAllGenres,
};
