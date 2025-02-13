<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        {{ isEditing ? "Editar Usuário" : "Criar Usuário" }}
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="form.username" label="Username" required></v-text-field>
        <v-select v-model="form.roles" label="Roles" :items="rolesOptions" multiple></v-select>
        <v-switch v-model="form.active" label="Ativo?"></v-switch>
        <v-text-field v-model="form.timezone" label="Fuso Horário"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="$emit('close')" color="grey">Cancelar</v-btn>
        <v-btn @click="saveUser" color="primary">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from "vue";

const props = defineProps({ user: Object });
const emit = defineEmits(["close", "save"]);

const dialog = ref(true); // Definir dialog como propriedade reativa

const rolesOptions = ["Admin", "Manager", "Tester"];

const form = ref({
  username: "",
  password: "",
  roles: [],
  active: true,
  timezone: ""
});

const isEditing = computed(() => !!props.user?.id);

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.value = { ...newUser };
      form.value.password = "";  // Clear password field when editing
    }
  },
  { immediate: true }
);

const saveUser = async () => {
  const method = isEditing.value ? "PUT" : "POST";
  const url = isEditing.value
    ? `http://127.0.0.1:5000/users/${props.user.id}`
    : "http://127.0.0.1:5000/users";

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form.value)
  });

  emit("save");
  emit("close");
};
</script>
