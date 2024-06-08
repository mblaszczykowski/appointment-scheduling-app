import axios from "axios";
import { SERVER_URL } from "@env";

const axiosInstance = axios.create({
	baseURL: "http://localhost:8080/"
});

export default axiosInstance;
