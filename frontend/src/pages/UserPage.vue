<template>
  <v-container>
    <v-card v-if="user">
      <v-card-title>{{ user.username }}</v-card-title>
      <v-card-text>
        <p><strong>Roles:</strong> {{ formattedRoles }}</p>
        <p><strong>Timezone:</strong> {{ user.timezone }}</p>
        <p><strong>Active?</strong> {{ user.active ? "Yes" : "No" }}</p>
        <p><strong>Created at:</strong> {{ formatTimestamp(user.created_at) }}</p>
        <p><strong>Last Update:</strong> {{ formatTimestamp(user.updated_at) }}</p>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="openEditModal" color="primary">Edit</v-btn>
        <v-btn @click="confirmDelete" color="red">Delete</v-btn>
        <v-btn to="/" color="grey">Back</v-btn>
      </v-card-actions>
    </v-card>

    <UserModal v-if="modalOpen" :user="user" @close="modalOpen = false" @save="fetchUser" />
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from 'vuex';
import UserModal from "@/components/UserModal.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const user = computed(() => store.state.selectedUser);
const modalOpen = ref(false);

const fetchUser = async () => {
  await store.dispatch('fetchUserById', route.params.id);
};

const confirmDelete = async () => {
  if (confirm("Are you sure you want to delete this user?")) {
    await store.dispatch('deleteUserById', route.params.id);
    router.push("/");
  }
};

const openEditModal = () => {
  modalOpen.value = true;
};

const formatTimestamp = store.getters.formatTimestamp;

const formattedRoles = computed(() => {
  if (!user.value || !Array.isArray(user.value.roles)) return 'User';
  const allowedRoles = ["admin", "manager", "tester"];
  const roles = user.value.roles
    .filter(role => allowedRoles.includes(role.toLowerCase()))
    .map(role => role.charAt(0).toUpperCase() + role.slice(1));
  return roles.length ? roles.join(", ") : "User";
});

onMounted(fetchUser);
</script>
