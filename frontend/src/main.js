import { createApp } from 'vue';
import App from './App.vue';
import { store } from './store/userStore';
import router from './router';
import { vuetify } from './plugins/vuetify';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(vuetify);

app.mount('#app');
