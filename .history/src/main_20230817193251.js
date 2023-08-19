import Vue from 'vue'
import App from './App.vue'
import Moment from 'moment'
import router from "./router/index.js";
import { Button, ButtonGroup, DatePicker, Message, Dialog } from 'element-ui';
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(DatePicker)
Vue.use(Dialog)
Vue.config.productionTip = false
Vue.prototype.$moment = Moment;
Vue.prototype.$message = Message;


new Vue({
  router,
  render: h => h(App)
}).$mount("#app");