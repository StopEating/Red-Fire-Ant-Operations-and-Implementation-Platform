import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "element-plus/theme-chalk/el-message.css";
import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-message-box.css';
import VueCookies from 'vue-cookies';

// import 'default-passive-events'
import $ from 'jquery'
const app = createApp(App)


 //引入
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {initAMapApiLoader} from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css'

initAMapApiLoader({
    key: '64dc37274ce690078a396a66b194e7ec',
  securityJsCode: '28668eab8a3f3a7fc19bc43bb3b56f0d',
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.globalProperties.$cookies = VueCookies
app.use(store).use(router).mount('#app')
