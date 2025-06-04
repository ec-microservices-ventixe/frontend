<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue';
import { useFetch } from '../../Composables/useFetch';
import type { IBooking } from '../../Interfaces/IBooking';
import type { IEvent, IPackage } from '../../Interfaces/IEvent';
import Modal from '../../components/Modal.vue';

const eventUrl = inject("EventServiceUrl");
const bookingUrl = inject("BookingServiceUrl");
const { data: bookings, error: bookingsError, loading: loadingBookings, fetch: fetchBookings } = useFetch<IBooking[]>(`${bookingUrl}/bookings/customers-bookings`, true);

interface IBookingComposedWithEvent {
  bookingId: number;
  priceToPay: number;
  numberOfTickets: number;
  eventName: string;
  packageName: string | null | undefined;
  eventCategory: string
}

const BookingsComposedWithEvent = reactive<IBookingComposedWithEvent[]>([])

const showModal = ref(false)
const message = ref('')
const loadingComposedData = ref(true)

onMounted(async () => {
  await fetchBookings
  if(!bookings.value) return

  for(const booking of bookings.value) {
    const res = await fetch(`${eventUrl}/events/${booking.eventId}`, {method: 'GET'})
    if(!res.ok) return
    const eventData: IEvent = await res.json()
    if(eventData) {
      BookingsComposedWithEvent.push(
        {bookingId: booking.id, 
          priceToPay: booking.priceToPay, 
          eventName: eventData.name, 
          packageName: booking.packageId ? eventData.packages.find((x: IPackage) => x.id === booking.packageId)?.name : null, 
          eventCategory: eventData.category ? eventData.category.name : "other",
          numberOfTickets: booking.amountOfTickets
        });
    } 
    loadingComposedData.value = false
  }});

</script>

<template>
  <Modal :message="message" :show="showModal"/>
  <div class="list-view">
    <div v-if="loadingBookings || loadingComposedData">
      <p>Loading bookings...</p>
    </div>
    <div v-if="bookingsError">
      <p>Sorry, we have some issues getting your bookings right now</p>
    </div>
    <div class="card-wrapper" v-if="BookingsComposedWithEvent.length > 0" v-for="item in BookingsComposedWithEvent" :key="item.bookingId">
      <div class="card-content">
        <h4>Booking Id: {{ item.eventName }}</h4>
        <div class="button-group">
          <button class="btn btn-primary">Unbook</button>
        </div>
      </div>
    </div>
  </div>
</template>