import axios from "axios";
import { ENV } from "../config/env";

const baseAPI = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
});

export default baseAPI;
