import { defineBoot } from '#q-app';
import axios from 'axios';

// Створюємо інстанс Axios з базовою URL-адресою з файлу конфігурації
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default defineBoot(({ app, router }) => {
  // 1. Перехоплювач запитів: автоматично додаємо токен авторизації
  api.interceptors.request.use(
    (config) => {
      // Завдяки auto-import викликаємо стор без ручного імпорту
      const authStore = useAuthStore();
      
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }
      return config;
    },
    (error) => {
      const rejectError = error instanceof Error ? error : new Error(String(error));
      return Promise.reject(rejectError);
    }
  );

  // 2. Перехоплювач відповідей: автоматично реагуємо на 401 помилку
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const authStore = useAuthStore();

      if (error.response && error.response.status === 401) {
        // Очищаємо сесію користувача
        authStore.logout();
        
        // Перенаправляємо на сторінку логіну
        await router.push('/auth/login');
      }

      const rejectError = error instanceof Error ? error : new Error(String(error));
      return Promise.reject(rejectError);
    }
  );

  // Дозволяє використовувати Options API через this.$axios та this.$api
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

// Експортуємо axios та api (вони підтягнуться через auto-import в будь-якому місці додатку)
export { axios, api };