import axios from "axios";

const Axios = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    const originalRequest = err.config;

    if (originalRequest.url === "/auth/refresh") {
      return;
    }

    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await Axios.get("/auth/refresh");
      return Axios(originalRequest);
    }
    return Promise.reject(err);
  }
);

export { Axios };
