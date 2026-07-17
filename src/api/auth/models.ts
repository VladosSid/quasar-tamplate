// Спільна модель користувача
export interface User {
  id: number;
  email: string;
  role: string;
  name: string;
}

// Тіло запиту на логін
export interface LoginRequest {
  email: string;
  password: string;
}

// Структура успішної відповіді сервера при логіні
export interface LoginResponse {
  token: string;
  user: User;
}