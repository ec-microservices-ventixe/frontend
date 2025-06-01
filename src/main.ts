import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import './style.css'
import App from './App.vue'
import Layout from './components/Layout.vue'
import HomePage from './pages/HomePage.vue'
import AboutPage from './pages/AboutPage.vue'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SignInPage from './pages/auth/SignInPage.vue'
import SignUpPage from './pages/auth/SignUpPage.vue'
import ConfirmEmail from './pages/auth/ConfirmEmail.vue'
import ReSendEmailConfirmation from './pages/auth/ReSendEmailConfirmation.vue'
import AddEvent from './pages/events/AddEvent.vue'
import ManageEvents from './pages/events/ManageEvents.vue'

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
        },
        {
            path: 'events/add',
            component: AddEvent,
            meta: { adminsOnly: true } 
        },
        {
            path: 'events/manage',
            component: ManageEvents,
            meta: { adminsOnly: true } 
        }
    ] }
  ]

const router = createRouter({
history: createWebHistory(),
routes,
})

router.beforeEach((to, _, next) => {
  try {
    if (to.meta.adminsOnly) {
      const token = localStorage.getItem('ventixeAccessToken')
      if (!token) {
        return next('/')
      }
      const tokenParts = token.split('.')
      const payload = JSON.parse(atob(tokenParts[1]))

      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]

      if (role !== 'Admin') {
        return next('/')
      }
    }
    next()
  } catch (err) {
    console.error('Token parse error:', err)
    next('/')
  }
})

library.add(faBars);
const app = createApp(App);
app.provide("AuthServiceUrl", import.meta.env.VITE_AUTH_SERVICE_URL)
app.use(router)
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app')
