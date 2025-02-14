<template>
  <v-container>
    <v-row justify="end">
      <v-btn v-if="users && users.length > 0" @click="openCreateModal" color="success">
        Create User
      </v-btn>
    </v-row>

    <v-data-table
      v-if="users && users.length > 0"
      :headers="headers"
      :items="formattedUsers"
      class="mt-4"
    >
      <template v-slot:[`item.username`]="{ item }">
        <router-link :to="`/user/${item.id}`" class="custom-link">{{ item.username }}</router-link>
      </template>

      <template v-slot:[`item.roles`]="{ item }">
        {{ item.roles }}
      </template>

      <template v-slot:[`item.timezone`]="{ item }">
        {{ item.timezone }}
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <div class="actions-container">
          <v-icon @click="openEditModal(item.id)" color="blue">mdi-pencil</v-icon>
          <v-icon @click="confirmDelete(item.id)" color="red" class="ml-2">mdi-delete</v-icon>
        </div>
      </template>
    </v-data-table>

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
import { useStore } from 'vuex';
import UserModal from "@/components/UserModal.vue";

const store = useStore();
const modalOpen = ref(false);

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
  if (store) {
    await store.dispatch('fetchUsers');
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

const formatRoles = (roles) => {
  if (!Array.isArray(roles) || roles.length === 0) {
    return "User";
  }

  const allowedRoles = ["admin", "manager", "tester"];
  const filteredRoles = roles
    .filter(role => allowedRoles.includes(role.toLowerCase()))
    .map(role => role.charAt(0).toUpperCase() + role.slice(1));

  return filteredRoles.length ? filteredRoles.join(", ") : "User";
};

const formatTimezone = (timezone) => {
  return timezone.replace(/_/g, " ");
};

const formattedUsers = computed(() =>
  store.state.users.map(user => ({
    ...user,
    updated_at: formatTimestamp(user.updated_at),
    created_at: formatTimestamp(user.created_at),
    roles: formatRoles(user.roles),
    timezone: formatTimezone(user.timezone)
  }))
);

const openCreateModal = () => {
  store.commit('setSelectedUser', null);
  modalOpen.value = true;
};

const openEditModal = async (id) => {
  if (store) {
    await store.dispatch('fetchUserById', id);
    modalOpen.value = true;
  }
};

const confirmDelete = async (id) => {
  if (confirm("Are you sure you want to delete this user?")) {
    if (store) {
      await store.dispatch('deleteUser', id);
      loadUsers();
    }
  }
};

const handleSave = () => {
  modalOpen.value = false;
  loadUsers();
};

const users = computed(() => store.state.users);
const selectedUser = computed(() => store.state.selectedUser);

onMounted(loadUsers);
</script>

<style scoped>
.actions-container {
  display: flex;
  gap: 8px;
}

.custom-link {
  text-decoration: none;
  color: inherit;
}

.custom-link:hover {
  text-decoration: none;
  color: blue;
}
</style>
