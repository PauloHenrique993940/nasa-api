import axios from 'axios';

export const api = axios.create({
  baseURL: 'GVIvwAQi1LSLkQcejhmeHJBhHYeGgW0Bord121mo', // Substitua pela sua URL
  headers: {
    'Content-Type': 'application/json',
  },
});
