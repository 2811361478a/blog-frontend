import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

export function login({ username, pwd }) {
  return axios.post(`${BASE_URL}/Users/login`, { username, pwd })
}

export function register({ username, pwd }) {
  return axios.post(`${BASE_URL}/Users/register`, { username, pwd })
}
