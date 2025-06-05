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
import EventDetails from './pages/events/EventDetails.vue'
import EditEvent from './pages/events/EditEvent.vue'
import BookingsPage from './pages/bookings/BookingsPage.vue'
import { useTokenManager } from './Composables/UseTokenManager'

const tokenManager = useTokenManager();

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
            path: 'events/:id',
            component: EventDetails,
        },
        {
            path: 'events/add',
            component: AddEvent,
            meta: { adminsOnly: true } 
        },
        {
            path: 'events/update/:id',
            component: EditEvent,
            meta: { adminsOnly: true } 
        },
        {
            path: 'events/manage',
            component: ManageEvents,
            meta: { adminsOnly: true } 
        },
        {
            path: 'bookings',
            component: BookingsPage,
        }
    ] }
  ]

const router = createRouter({
history: createWebHistory(),
routes,
})

router.beforeEach( async (to, _, next) => {
  try {
    if (to.meta.adminsOnly) {
      const token = tokenManager.getToken()
      if(token === null) await tokenManager.refreshToken()
      const role = tokenManager.getCurrentUserRole()
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
app.provide("AuthServiceUrl", "https://ventixe-auth-service-bxfpa3epcchzazgp.swedencentral-01.azurewebsites.net")
app.provide("EventServiceUrl", "https://ventixe-event-service-cjebcpbnf0ejcnbw.swedencentral-01.azurewebsites.net")
app.provide("BookingServiceUrl", "https://ventixe-event-booking-service-avgjandvcxcnetev.swedencentral-01.azurewebsites.net")
app.use(router)
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app')
