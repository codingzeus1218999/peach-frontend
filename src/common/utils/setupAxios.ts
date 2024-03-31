import axios from "axios";
import { ENV_CONSTANTS } from "../constants/env.const";

export const setAxiosBaseUrl = () => {
  axios.defaults.baseURL = ENV_CONSTANTS.API_BASEURL;
  axios.defaults.headers.common["Authorization"] =
    "Bearer a7cf7eee-165b-11ee-be56-0242ac120002";
};
