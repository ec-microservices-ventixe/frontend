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
        },
        {
            path: '/auth/signin',
            component: SignInPage
        },
        {
            path: '/auth/signup',
            component: SignUpPage
        },
        {
            path: '/auth/confirm-email',
            component: ConfirmEmail
        },
        {
            path: '/auth/resend-email-confirmation',
            component: ReSendEmailConfirmation
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
import SignInPage from './pages/auth/SignInPage.vue'
import SignUpPage from './pages/auth/SignUpPage.vue'
import ConfirmEmail from './pages/auth/ConfirmEmail.vue'
import ReSendEmailConfirmation from './pages/auth/ReSendEmailConfirmation.vue'

library.add(faBars);
const app = createApp(App);
app.provide("AuthServiceUrl", import.meta.env.VITE_AUTH_SERVICE_URL)
app.use(router)
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app')
