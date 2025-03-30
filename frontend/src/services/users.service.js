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
const baseUrl = '/api/v1/users';

async function fetchUsers(page, limit = 12) {
    const url = `${baseUrl}?page=${page}&limit=${limit}`;
    const data = await efetch(url);
    data.users = data.users.map((user) => {
        return {
            ...user,
            avatar: user.avatar ?? DEFAULT_AVATAR
        };
    });
    return data;
}
async function fetchUser(id) {
    const { user } = await efetch(`${baseUrl}/${id}`);
    return {
      ...user,
      avatar: user.avatar ?? DEFAULT_AVATAR
    };
}
async function createUser(User) {
    return efetch(baseUrl, {
        method: 'POST',
        body: User,
    });
}
async function deleteAllUsers() {
    return efetch(baseUrl, {
        method: 'DELETE',
    });
}
async function updateUser(id, User) {
    return efetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: User,
    });
}

async function deleteUser(id) {
    return efetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
    });
}
async function ChangePassword(id, newPassword, oldPassword) {
    console.log(newPassword, oldPassword)
    return efetch(`${baseUrl}/${id}/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, oldPassword })
    });
}
async function login({ email, password }) {
    const url = `/api/v1/login`;
    const data = await efetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    // Chuẩn hóa dữ liệu trả về, bao gồm token và user
    return {
        user: data.user,
        token: data.token
    };
}

export default {
    login,
    fetchUsers,
    fetchUser,
    createUser,
    deleteAllUsers,
    updateUser,
    deleteUser,
    ChangePassword
}