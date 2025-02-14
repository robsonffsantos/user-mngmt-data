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

        <v-switch v-model="form.active" label="Ativo?"></v-switch>

        <v-select v-model="form.timezone" label="Fuso Horário" :items="timezoneOptions"></v-select>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="$emit('close')" color="grey">Cancelar</v-btn>
        <v-btn @click="confirmSave" color="primary">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from "vue";
import { createUser, updateUser } from "../services/userService.js";

const props = defineProps({ user: Object });
const emit = defineEmits(["close", "save"]);

const dialog = ref(true);

const rolesOptions = ["admin", "manager", "tester"];

const timezoneOptions = [
  "Pacific/Midway", "Pacific/Pago_Pago", "Pacific/Honolulu", "America/Anchorage", 
  "America/Los_Angeles", "America/Tijuana", "America/Denver", "America/Phoenix",
  "America/Chicago", "America/Regina", "America/Mexico_City", "America/Guatemala",
  "America/New_York", "America/Bogota", "America/Lima", "America/Caracas",
  "America/Halifax", "America/La_Paz", "America/Santiago", "America/St_Johns",
  "America/Sao_Paulo", "America/Argentina/Buenos_Aires", "America/Guyana",
  "America/Montevideo", "Atlantic/South_Georgia", "Atlantic/Azores",
  "Atlantic/Cape_Verde", "Europe/Dublin", "Europe/London", "Europe/Lisbon",
  "Europe/Amsterdam", "Europe/Belgrade", "Europe/Berlin", "Europe/Bratislava",
  "Europe/Brussels", "Europe/Budapest", "Europe/Copenhagen", "Europe/Ljubljana",
  "Europe/Madrid", "Europe/Paris", "Europe/Prague", "Europe/Rome", "Europe/Sarajevo",
  "Europe/Skopje", "Europe/Stockholm", "Europe/Vienna", "Europe/Warsaw",
  "Europe/Zagreb", "Europe/Athens", "Europe/Bucharest", "Africa/Cairo",
  "Africa/Harare", "Europe/Helsinki", "Europe/Kiev", "Europe/Riga",
  "Europe/Sofia", "Europe/Tallinn", "Europe/Vilnius", "Europe/Istanbul",
  "Asia/Jerusalem", "Asia/Baghdad", "Asia/Kuwait", "Asia/Riyadh", "Asia/Tehran",
  "Africa/Nairobi", "Asia/Kabul", "Asia/Karachi", "Asia/Yekaterinburg",
  "Asia/Kolkata", "Asia/Kathmandu", "Asia/Almaty", "Asia/Dhaka",
  "Asia/Novosibirsk", "Asia/Bangkok", "Asia/Jakarta", "Asia/Krasnoyarsk",
  "Asia/Shanghai", "Asia/Chongqing", "Asia/Hong_Kong", "Asia/Irkutsk",
  "Asia/Kuala_Lumpur", "Asia/Singapore", "Asia/Taipei", "Australia/Perth",
  "Asia/Seoul", "Asia/Tokyo", "Asia/Yakutsk", "Australia/Adelaide",
  "Australia/Darwin", "Australia/Brisbane", "Australia/Hobart", "Australia/Sydney",
  "Pacific/Guam", "Pacific/Port_Moresby", "Asia/Vladivostok", "Asia/Magadan",
  "Pacific/Fiji", "Pacific/Auckland"
];

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
        roles: [...(newUser.roles || [])], // Corrigido para garantir que um novo array seja criado
        active: newUser.active ?? true,
        timezone: newUser.timezone || ""
      };
    }
  },
  { immediate: true }
);

// Alternar role entre selecionado e não selecionado
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
    const confirmed = confirm("Tem certeza de que deseja salvar as alterações?");
    if (!confirmed) return;
  }
  await saveUser();
};

const saveUser = async () => {
  if (isEditing.value) {
    await updateUser(props.user.id, form.value);
  } else {
    await createUser(form.value);
  }
  emit("save");
  emit("close");
};
</script>