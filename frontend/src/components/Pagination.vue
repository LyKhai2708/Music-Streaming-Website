<script setup>
  import { computed } from 'vue';
  const props = defineProps({
    totalPages: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      default: 3,
    },
    currentPage: { 
      type: Number,
      default: 1,
    },
  });
  const $emit = defineEmits(['update:currentPage']); 
  
  const pages = computed(() => { 
    const pages = [];
    const half = Math.floor(props.length / 2); 
    let start = props.currentPage - half;
    let end = props.currentPage + half;
    
    if (start <= 0) {
      start = 1;
      end = props.length;
    }
    if (end > props.totalPages) {
      end = props.totalPages;
      start = end - props.length + 1;
      if (start <= 0) start = 1;
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });
</script>

<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a role="button" class="page-link" @click.prevent="$emit('update:currentPage', currentPage - 1)">
          <i class="fas fa-chevron-left"></i> <!-- Thêm biểu tượng mũi tên trái -->
        </a>
      </li>

      <li
        v-for="page in pages"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page, 'bg-success': currentPage === page }" 
      >
        <a role="button" class="page-link" @click.prevent="$emit('update:currentPage', page)">
          {{ page }}
        </a>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a role="button" class="page-link" @click.prevent="$emit('update:currentPage', currentPage + 1)">
          <i class="fas fa-chevron-right"></i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* Pagination Styles */
.pagination {
  margin-top: 20px;
}

.page-item {
  margin: 0 5px; /* Thêm khoảng cách giữa các trang */
}

.page-link {
  background-color: #343a40; 
  color: #f8f9fa; 
  border: 1px solid #28a745; 
  border-radius: 5px; 
  font-size: 1rem;
  padding: 10px 15px; 
}

.page-link:hover {
  background-color: #28a745; 
  color: white;
}

.page-item.disabled .page-link {
  color: #6c757d; 
  pointer-events: none;
}

.page-item.active .page-link {
  background-color: #28a745; 
  color: white; 
}


.page-link i {
  font-size: 1.2rem;
}


@media (max-width: 767px) {
  .pagination {
    font-size: 0.9rem; 
  }
}
</style>
