import Vue from 'vue'
import App from './App.vue'
import Moment from 'moment'
import router from "./router/index.js";
import { Button, ButtonGroup, DatePicker, Message, Dialog, Col, Menu, MenuItem, Row } from 'element-ui';
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(DatePicker)
Vue.use(Dialog)
Vue.use(Col)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Row)
Vue.config.productionTip = false
Vue.prototype.$moment = Moment;
Vue.prototype.$message = Message;


new Vue({
  router,
  render: h => h(App)
}).$mount("#app");