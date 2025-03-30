import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { DEFAULT_AVATAR } from "@/constants";

const baseUrl = '/api/v1/users';

async function efetch(url, options = {}) {
    const response = await fetch(url, options);
    const json = await response.json();

    if (!response.ok || json.status !== 'success') {
        throw new Error(json.message);
    }

    return json.data;
}

export function useUsers() {
    const queryClient = useQueryClient();

    function getUsers(page, limit = 12) {
        const { data: usersData, ...rest } = useQuery({
            queryKey: ['users', page],
            queryFn: async () => {
                const url = `${baseUrl}?page=${page}&limit=${limit}`;
                const data = await efetch(url);
                data.users = data.users.map((user) => ({
                    ...user,
                    avatar: user.avatar ?? DEFAULT_AVATAR
                }));
                return data;
            },
            keepPreviousData: true,
        });
        return { usersData, ...rest };
    }

    function getUser(id) {
        const { data: userData, ...rest } = useQuery({
            queryKey: ['user', id],
            queryFn: async () => {
                const { user } = await efetch(`${baseUrl}/${id}`);
                return {
                    ...user,
                    avatar: user.avatar ?? DEFAULT_AVATAR
                };
            },
        });
        return { userData, ...rest };
    }

    function createUser() {
        return useMutation({
            mutationFn: async (User) => {
                const formData = new FormData();
                Object.entries(User).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                return efetch(baseUrl, {
                    method: 'POST',
                    body: formData,
                });
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['users']);
            },
        });
    }

    function updateUser() {
        return useMutation({
            mutationFn: async ({ id, User }) => {
                const formData = new FormData();
                Object.entries(User).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                return efetch(`${baseUrl}/${id}`, {
                    method: 'PUT',
                    body: formData,
                });
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['users']);
                queryClient.invalidateQueries(['user']);
            },
        });
    }

    function deleteAllUsers() {
        return useMutation({
            mutationFn: async () => {
                return efetch(baseUrl, { method: 'DELETE' });
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['users']);
            },
        });
    }

    function deleteUser() {
        return useMutation({
            mutationFn: async (id) => {
                return efetch(`${baseUrl}/${id}`, { method: 'DELETE' });
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['users']);
            },
        });
    }

    return {
        getUsers,
        getUser,
        createUser,
        updateUser,
        deleteAllUsers,
        deleteUser
    };
}
