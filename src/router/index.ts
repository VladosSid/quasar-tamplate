import { defineRouter } from '#q-app';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });

  // 🛡️ ГЛОБАЛЬНИЙ ЗАХИСТ МАРШРУТІВ (Navigation Guard)
  Router.beforeEach((to, from, next) => {
    // Імітуємо отримання стану користувача (сюди ти підключиш свій Pinia стор)
    // Наприклад: const authStore = useAuthStore();
    const isAuthenticated = false; // Зміни на true для тесту
    const userRole = 'user';       // Може бути 'admin', 'user' тощо

    // Зміна тайтлу сторінки (опціонально, беремо з метаданих)
    if (to.meta.title) {
      document.title = `${to.meta.title} | Мій Додаток`;
    }

    // ПЕРЕВІРКА ДЛЯ АВТОРИЗОВАНИХ (РЕДІРЕКТ З ЛОГІНУ) 👈 НАША НОВА ЛОГІКА
    if (to.meta.onlyGuests && isAuthenticated) {
      // Якщо користувач ВЖЕ в системі, але намагається зайти на /auth/login
      return next({ name: '/' }); // Викидаємо його на головну сторінку
    }

    // Перевірка: чи вимагає сторінка авторизації?
    if (to.meta.requiresAuth && !isAuthenticated) {
      // Якщо користувач не авторизований — відправляємо на сторінку логіну
      return next({ name: '/auth/Login' }); 
      // Примітка: у vue-router/auto-routes імена маршрутів збігаються з їхніми шляхами
    }

    // Перевірка: чи є у користувача потрібна роль для цієї сторінки?
    if (to.meta.roles && !to.meta.roles.includes(userRole)) {
      // Якщо роль не підходить — перенаправляємо на головну або сторінку 403 (Access Denied)
      return next({ name: '/' });
    }

    // Якщо все добре — дозволяємо перехід
    next();
  });

  // enable HMR for it
  if (import.meta.hot) {
    handleHotUpdate(Router);
  }

  return Router;
});
