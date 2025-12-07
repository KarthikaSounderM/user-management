import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE || "https://reqres.in/api";
const instance = axios.create({ baseURL });

// attach API key if provided in env
instance.interceptors.request.use((config) => {
  const key = import.meta.env.VITE_API_KEY;
  if (key && config.headers) config.headers["x-api-key"] = key;
  return config;
});

export default instance;
