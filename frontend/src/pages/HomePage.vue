<template>
  <v-container>
    <v-row justify="end">
      <v-btn v-if="users.length" @click="openCreateModal" color="success">
        Create User
      </v-btn>
    </v-row>

    <v-data-table
      v-if="users.length"
      :headers="headers"
      :items="formattedUsers"
      class="mt-4"
    >
      <template v-slot:[`item.username`]="{ item }">
        <router-link :to="`/user/${item.id}`">{{ item.username }}</router-link>
      </template>

      <template v-slot:[`item.roles`]="{ item }">
        {{ item.roles }}
      </template>

      <template v-slot:[`item.timezone`]="{ item }">
        {{ item.timezone }}
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <div class="actions-container">
          <v-icon @click="openEditModal(item)" color="blue">mdi-pencil</v-icon>
          <v-icon @click="confirmDelete(item.id)" color="red" class="ml-2">mdi-delete</v-icon>
        </div>
      </template>
    </v-data-table>

    <!-- Modal para Criar e Editar Usuários -->
    <UserModal
      v-if="modalOpen"
      :user="selectedUser"
      @close="modalOpen = false"
      @save="handleSave"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import UserModal from "@/components/UserModal.vue";
import { fetchUsers, deleteUser } from "@/services/userService";

const users = ref([]);
const modalOpen = ref(false);
const selectedUser = ref(null);

const headers = [
  { title: "Username", key: "username", width: "15%" },
  { title: "Roles", key: "roles", width: "20%" },
  { title: "Timezone", key: "timezone", width: "15%" },
  { title: "Is Active?", key: "active", width: "10%" },
  { title: "Last Updated", key: "updated_at", width: "15%" },
  { title: "Created At", key: "created_at", width: "15%" },
  { title: "Actions", key: "actions", sortable: false, width: "10%" }
];

const loadUsers = async () => {
  users.value = await fetchUsers();
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

const formatRoles = (roles) => {
  if (!Array.isArray(roles) || roles.length === 0) {
    return "User"; // Retorna "User" se não houver roles
  }

  const allowedRoles = ["admin", "manager", "tester"];
  
  const filteredRoles = roles
    .filter(role => allowedRoles.includes(role.toLowerCase())) // Filtra apenas os permitidos
    .map(role => role.charAt(0).toUpperCase() + role.slice(1)); // Capitaliza

  return filteredRoles.length ? filteredRoles.join(", ") : "User"; // Se não houver roles válidos, retorna "User"
};

const formatTimezone = (timezone) => {
  return timezone.replace(/_/g, " ");
};

const formattedUsers = computed(() =>
  users.value.map(user => ({
    ...user,
    updated_at: formatTimestamp(user.updated_at),
    created_at: formatTimestamp(user.created_at),
    roles: formatRoles(user.roles),
    timezone: formatTimezone(user.timezone)
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
    await deleteUser(id);
    loadUsers();
  }
};

const handleSave = () => {
  modalOpen.value = false;
  loadUsers();
};

onMounted(loadUsers);
</script>

<style scoped>
.actions-container {
  display: flex;
  gap: 8px; /* Espaço entre os ícones */
}
</style>
