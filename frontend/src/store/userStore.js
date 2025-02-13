import { createStore } from 'vuex';

export const store = createStore({
  state: {
    users: [],
    selectedUser: null,
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
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      commit('setUsers', data);
    },
    async fetchUserById({ commit }, userId) {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`);
      const data = await response.json();
      commit('setSelectedUser', data);
    },
  },
});
