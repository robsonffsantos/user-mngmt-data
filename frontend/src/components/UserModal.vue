<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        {{ isEditing ? "Edit User" : "Create User" }}
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="form.username" label="Username" required></v-text-field>

        <p>Roles</p>
        <v-row dense>
          <v-col v-for="role in rolesOptions" :key="role" cols="4">
            <v-btn
              :color="form.roles.includes(role) ? 'primary' : 'grey'"
              @click="toggleRole(role)"
              block
            >
              {{ role }}
            </v-btn>
          </v-col>
        </v-row>

        <v-switch v-model="form.active" label="Active?"></v-switch>

        <v-select v-model="form.timezone" label="Timezone" :items="timezoneOptions"></v-select>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="$emit('close')" color="grey">Cancel</v-btn>
        <v-btn @click="confirmSave" color="primary">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from "vue";
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps({ user: Object });
const emit = defineEmits(["close", "save"]);

const dialog = ref(true);

const rolesOptions = store.state.rolesOptions;
const timezoneOptions = store.state.timezoneOptions;

const form = ref({
  username: "",
  roles: [],
  active: true,
  timezone: ""
});

const isEditing = computed(() => !!props.user?.id);

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.value = {
        username: newUser.username || "",
        roles: [...(newUser.roles || [])],
        active: newUser.active ?? true,
        timezone: newUser.timezone || ""
      };
    }
  },
  { immediate: true }
);

const toggleRole = (role) => {
  const roles = new Set(form.value.roles);
  if (roles.has(role)) {
    roles.delete(role);
  } else {
    roles.add(role);
  }
  form.value.roles = [...roles];
};

const confirmSave = async () => {
  if (isEditing.value) {
    const confirmed = confirm("Are you sure you want to save the changes?");
    if (!confirmed) return;
  }
  await saveUser();
};

const saveUser = async () => {
  if (isEditing.value) {
    await store.dispatch('updateUser', { id: props.user.id, userData: form.value });
  } else {
    await store.dispatch('createUser', form.value);
  }
  emit("save");
  emit("close");
};
</script>
