<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import usersService from "@/services/users.service";
import InputSearch from "./InputSearch.vue";
export default {
  name: "AppHeader",
  setup() {
    const router = useRouter();


    const userName = ref("Guest");
    const userAvatar = ref("/public/images/OIP.jpg"); // Avatar mặc định
    const role = computed(() => localStorage.getItem("role"));
    const userid = ref(0);
    onMounted(async () => {
      if (userid) {
        userid.value = localStorage.getItem("userid"); 
        const userData = await usersService.fetchUser(userid.value);
        userName.value = userData.username;
        userAvatar.value = userData.avatar;
      }
    });
    // Hàm xử lý đăng xuất
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userid");
      router.push({ name: "login" });
    };

    return {
      userid,
      userName,
      userAvatar,
      role,
      logout,
    };
  },
};
</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">

    <a  class="navbar-brand"  :href="role === '0' ? '/' : '/admin'">
      <img src="./logo/test.png" alt="Avatar Logo" class="rounded-pill" style="width:50px; margin-left:30px;">
    </a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link :to="{ name: 'UserPage' }" class="nav-link"  active-class="active" v-if="role === '1'">Users</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'SongPage' }" class="nav-link" active-class="active" v-if="role === '1'">Songs</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'ArtistsPage' }" class="nav-link" active-class="active" v-if="role === '1'">Artists</router-link>
        </li>
        <li class="nav-item">

        </li>
        <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle d-flex align-items-center"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                :src="userAvatar"
                alt="User Avatar"
                class="rounded-circle"
                style="width:30px; height:30px; margin-right:10px;"
              />
              {{ userName }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <router-link
                  v-if="userid"
                  :to="{ name: 'ProfilePage', params: { id: userid } }"
                  class="dropdown-item"
                >
                  Profile
                </router-link>
              </li>
              <li>
                <router-link 
                v-if="userid"
                :to="{ name: 'ChangePasswordPage', params: { id: userid } }"
                class="dropdown-item">
                  Change password
                </router-link>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="logout">Logout</a>
              </li>
            </ul>
          </li>
      </ul>
    </div>
  </nav>
</template>
<style scoped>

.navbar .dropdown-toggle {
  cursor: pointer;
  color: #28a745;
  transition: color 0.3s ease;
}

.navbar .dropdown-toggle:hover {
  color: #fff;
}

.dropdown-menu {
  min-width: 150px;
}

.dropdown-item {
  color: #212529;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #28a745;
  color: #fff;
}

.navbar-nav .nav-link {
  font-size: 1.1rem;
  margin-right: 20px;
  color: #28a745;
  transition: color 0.3s ease-in-out;
}

.navbar-nav .nav-link:hover {
  color: #fff;
}

.navbar-nav .nav-link.active {
  font-weight: bold;
  color: #fff !important; 
  border-bottom: 2px solid #28a745; 
}

.navbar {
  padding: 10px 0;
}

/* Responsive navbar styling */
@media (max-width: 991px) {
  .navbar-nav .nav-link {
    font-size: 1rem;
    margin-right: 15px;
  }
}
</style>
