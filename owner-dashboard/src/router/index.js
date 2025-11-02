import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
