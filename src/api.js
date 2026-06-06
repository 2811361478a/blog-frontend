import axios from 'axios'

const BASE_URL = 'https://blog-backend-production-ad2a.up.railway.app'

export function login({ username, pwd }) {
  return axios.post(`${BASE_URL}/Users/login`, { username, pwd })
}

export function register({ username, pwd }) {
  return axios.post(`${BASE_URL}/Users/register`, { username, pwd })
}
