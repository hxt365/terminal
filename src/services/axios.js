import axios from "axios";

export const BASE_API_URL = `https://vfs-server.herokuapp.com/api/v1`;

const customAxios = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default customAxios;
