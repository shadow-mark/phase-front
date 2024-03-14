import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import cookies from "vue-cookies";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";
import axios from "axios";

axios.defaults.withCredentials = true;
if (process.env.NODE_ENV === "development") {
    axios.defaults.baseURL = "/api";
} else {
    axios.defaults.baseURL = "";
}

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(cookies);
app.config.globalProperties.$axios = axios;

app.mount("#app");
