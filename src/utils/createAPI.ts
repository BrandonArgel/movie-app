import axios from "axios";
import { API_BASE_URL } from "config"
const { REACT_APP_API_KEY } = process.env;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  },
  params: {
    api_key: REACT_APP_API_KEY,
  }
});