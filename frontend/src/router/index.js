import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import UserPage from '../pages/UserPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/user/:id', component: UserPage, props: true },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
