import axios from 'axios'

// instance axios globale
export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})
