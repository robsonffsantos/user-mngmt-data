import { createStore } from 'vuex';
import { fetchUsers, fetchUserById, createUser, updateUser, deleteUser } from "@/services/userService";

const rolesOptions = ["admin", "manager", "tester"];
const timezoneOptions = [
  "Pacific/Midway", "Pacific/Pago Pago", "Pacific/Honolulu", "America/Anchorage", 
  "America/Los Angeles", "America/Tijuana", "America/Denver", "America/Phoenix",
  "America/Chicago", "America/Regina", "America/Mexico City", "America/Guatemala",
  "America/New York", "America/Bogota", "America/Lima", "America/Caracas",
  "America/Halifax", "America/La_Paz", "America/Santiago", "America/St. Johns",
  "America/Sao Paulo", "America/Argentina/Buenos Aires", "America/Guyana",
  "America/Montevideo", "Atlantic/South Georgia", "Atlantic/Azores",
  "Atlantic/Cape Verde", "Europe/Dublin", "Europe/London", "Europe/Lisbon",
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
  "Asia/Kuala Lumpur", "Asia/Singapore", "Asia/Taipei", "Australia/Perth",
  "Asia/Seoul", "Asia/Tokyo", "Asia/Yakutsk", "Australia/Adelaide",
  "Australia/Darwin", "Australia/Brisbane", "Australia/Hobart", "Australia/Sydney",
  "Pacific/Guam", "Pacific/Port Moresby", "Asia/Vladivostok", "Asia/Magadan",
  "Pacific/Fiji", "Pacific/Auckland"
];

export const store = createStore({
  state: {
    users: [],
    selectedUser: null,
    rolesOptions,
    timezoneOptions,
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setSelectedUser(state, user) {
      state.selectedUser = user;
    },
  },
  actions: {
    async fetchUsers({ commit }) {
      const users = await fetchUsers();
      commit('setUsers', users);
    },
    async fetchUserById({ commit }, userId) {
      const user = await fetchUserById(userId);
      commit('setSelectedUser', user);
    },
    async createUser({ dispatch }, userData) {
      await createUser(userData);
      dispatch('fetchUsers');
    },
    async updateUser({ dispatch }, { id, userData }) {
      await updateUser(id, userData);
      dispatch('fetchUsers');
    },
    async deleteUser({ dispatch }, userId) {
      await deleteUser(userId);
      dispatch('fetchUsers');
    },
    async deleteUserById({ dispatch }, userId) {
      await deleteUser(userId);
      dispatch('fetchUsers');
    }
  },
  getters: {
    formatTimestamp: () => (timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    },
  },
});
