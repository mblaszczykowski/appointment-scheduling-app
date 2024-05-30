import client from "./client";

const login = (email, password) => client.post("http://localhost:8080/api/auth/login", { email, password });

export default {
  login,
};
