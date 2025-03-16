import { fetchApi } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  console.log('logging in with:', credentials);

  return fetchApi('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
};
interface RegisterData {
  name: string;
  email: string;
  password: string;
}
export const register = async (data: RegisterData) => {
  return fetchApi('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
