import { createRouter, createWebHistory } from 'vue-router';
import Login from '../Login.vue';
import Tracker from '../App.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/', name: 'Tracker', component: Tracker, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) return next('/login');
  }
  next();
});

export default router;
