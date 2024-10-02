import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5984',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('Admin:30115982Aib'),
  },
});

export default api;
