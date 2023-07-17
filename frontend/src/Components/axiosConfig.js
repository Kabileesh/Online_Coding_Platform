import axios from "axios";

axios.defaults.baseURL = "https://programz.onrender.com";

axios.interceptors.request.use(function (config) {
  const accessToken = sessionStorage.getItem("accessToken");
  if (
    config.url !== "login" &&
    config.url !== "register" &&
    config.url !== "verify-token"
  ) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response.status === 401 || err.response.data.err) {
      console.log("Logged out from config file");
      sessionStorage.clear();
      window.location.reload();
    }
  }
);

export default axios;
