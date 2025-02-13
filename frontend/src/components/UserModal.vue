<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        {{ isEditing ? "Editar Usuário" : "Criar Usuário" }}
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="form.username" label="Username" required></v-text-field>
        <v-text-field v-model="form.password" label="Password" type="password" required></v-text-field>
        <v-select v-model="form.roles" label="Roles" :items="rolesOptions" multiple></v-select>
        <v-switch v-model="form.active" label="Ativo?"></v-switch>
        <v-select v-model="form.timezone" label="Fuso Horário" :items="timezoneOptions"></v-select>
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

const dialog = ref(true);

const rolesOptions = ["admin", "manager", "tester", "active"];

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
