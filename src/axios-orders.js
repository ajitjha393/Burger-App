import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-burger-app-11993.firebaseio.com/"
});

export default instance;
