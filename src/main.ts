import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import './style.css'
import App from './App.vue'

import Layout from './components/Layout.vue'
import HomePage from './pages/HomePage.vue'
import AboutPage from './pages/AboutPage.vue'

const routes = [
    { path: '/', component: Layout, children: [
        {
            path: '',
            component: HomePage
        },
        {
            path: 'about',
            component: AboutPage
        }
    ] }
  ]

const router = createRouter({
history: createWebHistory(),
routes,
})

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBars);

const app = createApp(App);
app.use(router)
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app')
