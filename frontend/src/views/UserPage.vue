<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import UserCard from '@/components/UserCard.vue';
import InputSearch from '@/components/InputSearch.vue';
import UserList from '@/components/UserList.vue';
import userServices from '@/services/users.service';
import Pagination from '@/components/Pagination.vue';

const router = useRouter();
const route = useRoute();
const totalPages = ref(1);
const users = ref([]);
const selectedIndex = ref(-1);
const searchText = ref('');

const currentPage = computed(() => {
  const page = Number(route.query?.page);
  return Number.isNaN(page) || page < 1 ? 1 : page;
});

const searchableUsers = computed(() =>
  users.value.map((user) => {
    const { username, email } = user;
    return [username, email].join('');
  })
);

const filteredUsers = computed(() => {
  if (!searchText.value) return users.value;
  return users.value.filter((user, index) =>
    searchableUsers.value[index].includes(searchText.value)
  );
});

const selectedUser = computed(() => {
  if (selectedIndex.value < 0) return null;
  return filteredUsers.value[selectedIndex.value];
});

async function retrieveUsers(page) {
  try {
    const chunk = await userServices.fetchUsers(page);
    totalPages.value = chunk.metadata.lastPage ?? 1;
    users.value = chunk.users.sort(
      (current, next) => current.username.localeCompare(next.username)
    );
    selectedIndex.value = -1;
  } catch (error) {
    console.log(error);
  }
}
function refetch() {
  retrieveUsers(currentPage.value);
}

function goToAddUser() {
  router.push({ name: 'User.add' });
}

function changeCurrentPage(page) {
  router.push({ name: 'UserPage', query: { page } });
}

async function onDeleteUsers() {
  if (confirm('Xóa tất cả User trong hệ thống ?')) {
    try {
      await userServices.deleteAllUsers();
      totalPages.value = 1;
      users.value = [];
      selectedIndex.value = -1;
      changeCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  }
}

watch(searchText, () => (selectedIndex.value = -1));
watch(currentPage, () => retrieveUsers(currentPage.value), { immediate: true });
</script>


<template>
  <div class="page row mb-5">
    <!-- User List Column -->
    <div class="col-md-6 mt-5">
      <h4 class="d-flex align-items-center text-white">
        User List <i class="fas fa-users ms-2"></i>
      </h4>
      <div class="my-3">
        <InputSearch v-model="searchText" />
      </div>
      <UserList
        v-if="filteredUsers.length > 0"
        :users="filteredUsers"
        v-model:selected-index="selectedIndex"
      />
      <p v-else>No users found.</p>
      <div class="mt-4 d-flex justify-content-between">
        <Pagination
          :total-pages="totalPages"
          :current-page="currentPage"
          @update:current-page="changeCurrentPage"
        />
        <div>
          <button class="btn btn-lg btn-dark me-2" @click="refetch">
            <i class="fas fa-redo"></i>
          </button>
          <button class="btn btn-lg btn-success me-2" @click="goToAddUser">
            <i class="fas fa-plus"></i>
          </button>
          <button class="btn btn-lg btn-danger" @click="onDeleteUsers">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- User Details Column -->
    <div class="col-md-6 mt-5">
      <div v-if="selectedUser">
        <h4 class="d-flex align-items-center text-white">
          User Details <i class="fas fa-user ms-2"></i>
        </h4>
        <UserCard :user="selectedUser" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  text-align: center;
  max-width: 1950px;
}

.btn {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn-dark {
  background-color: #343a40;
  color: #f8f9fa;
  border: 1px solid #343a40;
}

.btn-dark:hover {
  background-color: #28a745;
  color: white;
  transform: scale(1.05);
}

.btn-success {
  background-color: #28a745;
  color: white;
  border: 1px solid #28a745;
}

.btn-success:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: 1px solid #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  transform: scale(1.05);
}

.pagination {
  margin-top: 20px;
}

.pagination .page-link {
  background-color: #343a40;
  color: white;
  border: 1px solid #28a745;
  font-size: 1rem;
  padding: 10px 15px;
  border-radius: 5px;
}

.pagination .page-link:hover {
  background-color: #28a745;
  color: white;
}

.pagination .page-item.active .page-link {
  background-color: #28a745;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
}

.pagination .page-item {
  margin: 0 5px;
}
</style>
