<template>
  <v-container>
    <v-card v-if="user">
      <v-card-title>{{ user.username }}</v-card-title>
      <v-card-text>
        <p><strong>Roles:</strong> {{ user.roles.join(", ") }}</p>
        <p><strong>Timezone:</strong> {{ user.timezone }}</p>
        <p><strong>Active?</strong> {{ user.active ? "Yes" : "No" }}</p>
        <p><strong>Created at:</strong> {{ formatTimestamp(user.created_at) }}</p>
        <p><strong>Last Update:</strong> {{ formatTimestamp(user.updated_at) }}</p>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="openEditModal" color="primary">Edit</v-btn>
        <v-btn @click="confirmDelete" color="red">Delete</v-btn>
        <v-btn to="/" color="grey">Voltar</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Modal para Edição -->
    <UserModal v-if="modalOpen" :user="user" @close="modalOpen = false" @save="fetchUser" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserModal from "@/components/UserModal.vue";

const route = useRoute();
const router = useRouter();
const user = ref(null);
const modalOpen = ref(false);

const fetchUser = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/users/${route.params.id}`);
    user.value = await response.json();
  } catch (error) {
    console.error("Erro ao carregar usuário:", error);
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000); // converter de segundos para milissegundos
  return date.toLocaleString(); // formato legível
};

const confirmDelete = async () => {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    await fetch(`http://127.0.0.1:5000/users/${route.params.id}`, { method: "DELETE" });
    router.push("/");
  }
};

const openEditModal = () => {
  modalOpen.value = true;
};

onMounted(fetchUser);
</script>
