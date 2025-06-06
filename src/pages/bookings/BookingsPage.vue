<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue';
import { useFetch } from '../../Composables/useFetch';
import type { IBooking } from '../../Interfaces/IBooking';
import type { IEvent, IPackage } from '../../Interfaces/IEvent';
import Modal from '../../components/Modal.vue';
import type { IBookingComposedWithEvent } from '../../Interfaces/IBookingComposedWithEcent';
import { useTokenManager } from '../../Composables/UseTokenManager';
import { useRouter } from 'vue-router';

const router = useRouter()
const eventUrl = inject("EventServiceUrl");
const bookingUrl = inject("BookingServiceUrl");
const { data: bookings, error: bookingsError, loading: loadingBookings, fetch: fetchBookings } = useFetch<IBooking[]>(`${bookingUrl}/bookings/customers-bookings`, true);
const tokenManager = useTokenManager()

const BookingsComposedWithEvent = reactive<IBookingComposedWithEvent[]>([])

const showModal = ref(false)
const message = ref('')
const closeModal = () => showModal.value = !showModal.value
const loadingComposedData = ref(true)

onMounted(async () => {
  await fetchBookings
  if(!bookings.value) return

  for(const booking of bookings.value) {
    const res = await fetch(`${eventUrl}/events/${booking.eventId}`, {method: 'GET'})
    if(!res.ok) {
      loadingComposedData.value = false
      return
    }
    const eventData: IEvent = await res.json()
    if(eventData) {
      BookingsComposedWithEvent.push(
        {bookingId: booking.id, 
          date: eventData.date.split('T')[0],
          priceToPay: booking.priceToPay, 
          eventName: eventData.name, 
          packageName: booking.packageId ? eventData.packages.find((x: IPackage) => x.id === booking.packageId)?.name : null, 
          eventCategory: eventData.category ? eventData.category.name : "other",
          numberOfTickets: booking.amountOfTickets
        });
    } 
    loadingComposedData.value = false
  }});

  const unbookEvent = async (id: number) =>  {
    try {
      const token = tokenManager.getToken()
      if(token === null) {
        const successfullyGotNewToken = await tokenManager.refreshToken()
          if(!successfullyGotNewToken) {
            return router.push("/auth/signin")
          }
      }
      const res = await fetch(`${bookingUrl}/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `bearer ${tokenManager.getToken()}`
        }
      })
      if(!res.ok) {
        message.value = 'Could not unbook event'
      } else {
        message.value = "You have successfully unbooked the event"
      }
      showModal.value = true
    } catch(error) {
      console.error(error)
      message.value = 'Could not unbook event'
      showModal.value = true
    }
  }

</script>

<template>
  <Modal :message="message" @close="closeModal" :show="showModal"/>
  <div class="list-view">
    <div v-if="loadingBookings || loadingComposedData">
      <p>Loading bookings...</p>
    </div>
    <div v-if="bookingsError">
      <p>Sorry, we have some issues getting your bookings right now</p>
    </div>
    <div v-if="BookingsComposedWithEvent.length === 0">
      <p>You have now bookings yet</p>
    </div>
    <table v-if="BookingsComposedWithEvent.length > 0">
      <thead>
        <tr>
          <th>Date</th>
          <th>Event</th>
          <th>Package</th>
          <th>Price</th>
          <th>Number of Tickets</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="BookingsComposedWithEvent.length > 0" v-for="item in BookingsComposedWithEvent" :key="item.bookingId">
          <td data-label="Date">{{ item.date }}</td>
          <td data-label="Event">
            <div>
              <p>{{ item.eventName }}</p>
              <p>{{ item.eventCategory }}</p>
            </div>
          </td>
          <td data-label="Package">{{ item.packageName ?  item.packageName : 'None'}}</td>
          <td data-label="Price">${{ item.priceToPay }}</td>
          <td data-label="Tickets "><p> {{ item.numberOfTickets }}</p></td>
          <td data-label="Action">
            <button class="btn btn-primary" @click="unbookEvent(item.bookingId)">UnBook</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  margin: auto auto;
  border-collapse: collapse;
}

th, td {
  border-bottom: 1px solid var(--primary-90);
  text-align: center;
  padding: 12px;
}

@media (max-width: 920px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }

  thead tr {
    display: none;
  }

  tr {
    margin-bottom: 1.5rem;
    border: 1px solid var(--primary-90);
    border-radius: 8px;
    padding: 12px;
  }

  td {
    text-align: left;
    padding-left: 50%;
    position: relative;
    border: none;
    border-bottom: 1px solid var(--primary-90);
  }

  td:last-child {
    border-bottom: none;
  }

  td::before {
    content: attr(data-label);
    position: absolute;
    left: 12px;
    top: 12px;
    font-weight: bold;
    white-space: nowrap;
  }

  button.btn {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>