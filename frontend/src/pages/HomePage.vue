<template>
  <v-container>
    <v-row justify="end">
      <v-btn v-if="users.length" @click="openCreateModal" color="success">
        Criar Usuário
      </v-btn>
    </v-row>

    <v-data-table v-if="users.length" :headers="headers" :items="formattedUsers" class="mt-4">
      <template v-slot:[`item.username`]="{ item }">
        <router-link :to="`/user/${item.id}`">{{ item.username }}</router-link>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="openEditModal(item)" color="blue">mdi-pencil</v-icon>
        <v-icon @click="confirmDelete(item.id)" color="red" class="ml-2">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Modal para Criar e Editar Usuários -->
    <UserModal v-if="modalOpen" :user="selectedUser" @close="modalOpen = false" @save="handleSave" />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import UserModal from "@/components/UserModal.vue";

const users = ref([]);
const modalOpen = ref(false);
const selectedUser = ref(null);

const headers = [
  { title: "Username", key: "username" },
  { title: "Roles", key: "roles" },
  { title: "Timezone", key: "timezone" },
  { title: "Is Active?", key: "active" },
  { title: "Last Updated", key: "updated_at" },
  { title: "Created At", key: "created_at" },
  { title: "Actions", key: "actions", sortable: false }
];

const fetchUsers = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/users");
    users.value = await response.json();
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

const formattedUsers = computed(() =>
  users.value.map(user => ({
    ...user,
    updated_at: formatTimestamp(user.updated_at),
    created_at: formatTimestamp(user.created_at)
  }))
);

const openCreateModal = () => {
  selectedUser.value = null;
  modalOpen.value = true;
};

const openEditModal = (user) => {
  selectedUser.value = { ...user };
  modalOpen.value = true;
};

const confirmDelete = async (id) => {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    await fetch(`http://127.0.0.1:5000/users/${id}`, { method: "DELETE" });
    fetchUsers();
  }
};

const handleSave = () => {
  modalOpen.value = false;
  fetchUsers();
};

onMounted(fetchUsers);
</script>
