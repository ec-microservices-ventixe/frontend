<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { useFetch } from '../../Composables/useFetch';
import { type IEvent } from '../../Interfaces/IEvent';
import { useRoute, useRouter } from 'vue-router';
import Modal from '../../components/Modal.vue';

const route = useRoute()
const router = useRouter()
const eventUrl = inject("EventServiceUrl")
const bookingUrl = inject("BookingServiceUrl")
const authUrl = inject("AuthServiceUrl")
const {data: eventData, error, loading, fetch: fetchEvent } = useFetch<IEvent>(`${eventUrl}/events/${route.params.id}`)
const {data: bookingCount, fetch: countBookings } = useFetch<number>(`${bookingUrl}/bookings/count-bookings?eventId=${route.params.id}`)
onMounted(async () => {
    await fetchEvent
    await countBookings
})

const showModal = ref(false)
const message = ref("")

const submitting = ref(false)

const amountOfTickets = ref(1)

const selectedPackage = ref(0)
const selectPackage = (id: number) => {
  selectedPackage.value === id 
    ? selectedPackage.value = 0 
    : selectedPackage.value = id;
};
const totalPrice = computed((): number => {
  const eventPrice = eventData.value?.price
  if(!eventPrice) return 0
  const eventPackage = eventData.value?.packages.find(p => p.id === selectedPackage.value)
  const extraCost = eventPackage?.extraFeeInProcent ? Math.round(eventPrice * eventPackage.extraFeeInProcent / 100) : 0;
  const totalcost = (eventPrice + extraCost) * amountOfTickets.value;
  return totalcost
})

const bookEventAsync = async () => {
  submitting.value = true;

  try {
    const res = await fetch(`${bookingUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("ventixeAccessToken")}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventId: eventData.value?.id,
        eventPackageId: selectedPackage.value,
        amountOfTickets: amountOfTickets.value,
        priceToPay: totalPrice.value
      })
    });

    if (res.status === 401) {
      const refreshRes = await fetch(`${authUrl}/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const newToken = refreshRes.headers.get("Bearer-Token");
      if (!newToken) {
        router.push('/auth/signin');
        return;
      }
      localStorage.setItem('ventixeAccessToken', newToken);
      return bookEventAsync();
    }
    const responseText = await res.text();
    if (res.ok) {
      message.value = "You have successfully booked this event!";
    } else {
      message.value = responseText || "Booking failed. Please try again.";
    }

    showModal.value = true;

  } catch (err) {
    message.value = "An unexpected error occurred.";
    showModal.value = true;
    console.error("Booking error:", err);
  } finally {
    submitting.value = false;
  }

  window.scrollTo(0,0);
};

</script>

<template>
  <Modal :show="showModal" :message="message"></Modal>
  <div v-if="loading">loading...</div>
  <div v-if="error">An error occurred</div>
  <div class="event-detail">
    <div class="image-container">
    <img v-if="eventData?.imageUrl" :src="eventData?.imageUrl"/>
    </div>
    <div class="details">
      <h1>{{ eventData?.name }}</h1>
      <p class="description">{{ eventData?.description }}</p>
      <div class="info-grid">
        <div><strong>Location:</strong> {{ eventData?.location }}</div>
        <div><strong>Date:</strong> {{ eventData?.date.split("T")[0] }}</div>
        <div><strong>Time:</strong> {{  eventData?.startTime.substring(0, eventData?.startTime.lastIndexOf(':')) }} - {{ eventData?.endTime.substring(0, eventData?.endTime.lastIndexOf(':')) }}</div>
        <div >Tickets Sold: <strong class="tickets-sold">{{ bookingCount }} </strong> / {{ eventData?.totalTickets }}</div>
        <div><strong>Price From <strong class="text-primary-100">${{ eventData?.price }}</strong></strong></div>
      </div>

      <div class="packages" v-for="eventPackage in eventData?.packages" :key="eventPackage.id">
        <h3>Packages</h3>
        <div :class="{active: selectedPackage === eventPackage.id }" class="package" @click="selectPackage(eventPackage.id)">
          <h4><strong>{{ eventPackage.name }}</strong></h4>
          <div class="package-info">
            <div class="package-info-benefits">
              <p>{{ eventPackage.benefits }}</p>
              <p>{{ eventPackage.isSeating ? "Seating" : "standing"}}</p>
            </div>
            <strong class="text-primary-100">${{ (Math.round(eventPackage.extraFeeInProcent * eventData?.price! / 100))}}</strong>
          </div>
        </div>
      </div>

      <div class="book-event">
        <h3>Book Event Now</h3>
        <div class="price">
          Total: <strong>${{ totalPrice }}</strong>
        </div>
        <div class="ticket-count">
          <label for="tickets">Tickets:</label>
          <input
            id="tickets"
            type="number"
            min="1"
            v-model.number="amountOfTickets"
          />
        </div>
        <button class="btn btn-primary" @click="bookEventAsync">
          {{ submitting ? '...Loading' : 'Confirm Booking'}}
        </button>
    </div>
    </div>
  </div>
</template>

<style scoped>
.event-detail {
  max-width: 700px;
  margin: 2rem auto;
  background: var(--gray-10);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}
strong {
  font-weight: bold;
}
.image-container img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.details {
  padding: 1.5rem;
}
.tickets-sold {
  font-size: 130%;
}
h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.description {
  color: var(--cool-gray-90);
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1.5rem;
  font-size: 1rem;
  color: var(--gray-90);
}

.info-grid div {
  padding: 0.75rem;
  border-radius: 8px;
}
.package {
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
  max-width: 350px;
  background-color: var(--cool-gray-20);
  border-radius: 12px;
  align-items: center;
}
.active {
  border-color: var(--primary-100);
  border-width: 2px;
  border-style: solid;
}
.package-info {
  background-color: var(--cool-gray-20);
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.package-info-benefits {
  display: flex;
  gap: 20px;
}
.book-event {
  border: 2px solid var(--gray-20);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
  max-width: 400px;
}
.price {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
.ticket-count {
  display: flex;
  align-items: center;
  border-radius: 70px;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.ticket-count input {
  width: 60px;
  padding: 0.4rem;
  border-radius: 5px;
  border-style: solid;
  border-width: 1px;
}
</style>