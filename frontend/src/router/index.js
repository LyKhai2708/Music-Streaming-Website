import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/views/Home.vue';
import UserHome from '@/views/user/UserHome.vue';
import SongPage from '@/views/SongPage.vue';
import UserAdd from '@/views/UserAdd.vue';
import ArtistPage from '@/views/ArtistsPage.vue';
import ArtistAdd from '@/views/ArtistAdd.vue';
import ArtistEdit from '@/views/ArtistEdit.vue';
import UserEdit from '@/views/UserEdit.vue';
import SongAll from '@/views/user/SongPage.vue'
import ArtistAll from '@/views/user/ArtistPage.vue'
import ArtistProfile from '@/views/user/ArtistProfile.vue';
import SongAdd from '@/views/SongAdd.vue';
import SongUpdate from '@/views/SongUpdate.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import {authGuard, roleGuard} from '../services/auth.service'
import UserPage from '@/views/UserPage.vue';
import ProfilePage from '@/views/user/UserProfile.vue';
import ChangePasswordPage from '@/views/user/ChangePasswordPage.vue';
// Các route cho User
const userRoutes = [
{
    path: '/',
    name: 'UserHome',
    component: UserHome,
    meta: { layout: 'MainLayout', requiredRole: 0 },
    beforeEnter: [authGuard, roleGuard], // Kiểm tra quyền của user
},
{
    path: '/all-song/',
    name: 'Song.All',
    component: SongAll,
    meta: { layout: 'MainLayout', requiredRole: 0 },
    beforeEnter: [authGuard, roleGuard],
},
{
    path: '/all-artist/',
    name: 'Artist.All',
    component: ArtistAll,
    meta: { layout: 'MainLayout', requiredRole: 0 },
    beforeEnter: [authGuard, roleGuard],
},
{
    path: '/artist/profile/:artistId',
    name: 'Artist.Profile',
    component: ArtistProfile,
    meta: { layout: 'MainLayout', requiredRole: 0 },
    beforeEnter: [authGuard, roleGuard],
    props: true,
},
{
    path: '/user/profile/:id',
    name: 'ProfilePage',
    component: ProfilePage,
    meta: { layout: 'MainLayout', requiredRole: 0 },
    beforeEnter: [authGuard, roleGuard],
    props: (route) => ({ id: route.params.id }),
},
{
    path: '/user/profile/:id/change-password',
    name: 'ChangePasswordPage',
    component: ChangePasswordPage,
    meta: { layout: 'MainLayout', requiredRole: 0 },
    beforeEnter: [authGuard, roleGuard],
    props: (route) => ({ id: route.params.id }),
}
];

// Các route cho Admin
const adminRoutes = [
  {
    path: '/admin',
    name: 'Home', // Trang chính cho Admin
    component: Home,
    meta: { layout: 'MainLayout', requiredRole: 1 },
    beforeEnter: [authGuard, roleGuard], // Kiểm tra quyền của admin
  },
  {
    path: '/admin/song',
    name: 'SongPage',
    component: SongPage,
    meta: { layout: 'MainLayout', requiredRole: 1 },
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/admin/song/add',
    name: 'Song.add',
    component: SongAdd,
    meta: { layout: 'MainLayout', requiredRole: 1 },
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/admin/song/:id',
    name: 'Song.update',
    component: SongUpdate,
    props: (route) => ({ id: route.params.id }),
    meta: { layout: 'MainLayout', requiredRole: 1 },
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/admin/users',
    name: 'UserPage',
    component: UserPage,
    meta: { layout: 'MainLayout', requiredRole: 1 },
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/admin/users/:id',
    name: 'User.edit',
    component: UserEdit,
    props: (route) => ({ id: route.params.id }),
    meta: { layout: 'MainLayout', requiredRole: 1 },
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/admin/user/add',
    name: 'User.add',
    component: UserAdd,
    meta: { layout: 'MainLayout', requiredRole: 1 },
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/admin/artists',
    name: 'ArtistsPage',
    component: ArtistPage,
    meta: { layout: 'MainLayout', requiredRole: 1 },
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/admin/artists/add',
    name: 'Artist.add',
    component: ArtistAdd,
    meta: { layout: 'MainLayout', requiredRole: 1 },
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/admin/artist/:id',
    name: 'Artist.edit',
    component: ArtistEdit,
    props: (route) => ({ id: route.params.id }),
    meta: { layout: 'MainLayout', requiredRole: 1 },
    beforeEnter: [authGuard, roleGuard],
  },
  
];

// Routes không yêu cầu đăng nhập (Login, Register)
const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { layout: 'AuthLayout' },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { layout: 'AuthLayout' },
  },
];

// Tổng hợp các routes
const routes = [
  ...userRoutes,  // Các route cho người dùng
  ...adminRoutes, // Các route cho admin
  ...authRoutes,  // Các route cho login, register
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
