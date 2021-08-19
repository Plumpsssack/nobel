import Vue from "vue";
import { draggablePlugin } from "./custom/directives/draggable";
import VueSmoothScroll from 'vue2-smooth-scroll'

Vue.use(draggablePlugin);
Vue.use(VueSmoothScroll)