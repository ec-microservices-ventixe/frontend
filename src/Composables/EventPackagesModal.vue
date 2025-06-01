<script setup lang="ts">
import { ref, watch } from 'vue';
import type { IEvent } from '../Interfaces/IEvent';

const props = defineProps<{
  eventId: number;
  show: boolean;
}>();
const emit = defineEmits(['close']);

const baseUrl = "https://ventixe-event-service-cjebcpbnf0ejcnbw.swedencentral-01.azurewebsites.net";
const eventData = ref<IEvent | null | undefined>(null);
const packageForm = ref({
  eventId: props.eventId,
  name: '',
  isSeating: false,
  benefits: '',
  extraFeeInProcent: 0
});

watch(
  () => props.eventId,
  async (newId) => {
    if (newId) {
      const res = await fetch(`${baseUrl}/events/${newId}`);
      if (res.ok) {
        eventData.value = await res.json();
      } else {
        console.error('Failed to load event');
      }
    } else {
      eventData.value = null;
    }
  },
  { immediate: true }
);

const addPackageAsync = async () => {
  packageForm.value.eventId = props.eventId;
  try {
    const res = await fetch(`${baseUrl}/Controller`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(packageForm.value),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('Failed to save package:', err);
      return;
    }
    packageForm.value = {
      eventId: props.eventId,
      name: '',
      isSeating: false,
      benefits: '',
      extraFeeInProcent: 0
    };
    const refreshed = await fetch(`${baseUrl}/events/${props.eventId}`);
    if (refreshed.ok) {
      eventData.value = await refreshed.json();
    }
  } catch (err) {
    console.error('Error while saving package:', err);
  }
};
</script>

<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal">
      <button class="btn btn-secondary mt-3" @click="$emit('close')">Close</button>
      <div class="form-container">
        <h3 class="form-title">Manage Packages for Event: {{ eventData?.name }}</h3>
        <form class="form" @submit.prevent="addPackageAsync">
          <input v-model="packageForm.name" type="text" class="form-input" placeholder="name" />
          <label>
            <input v-model="packageForm.isSeating" type="checkbox" class="form-input" />
            Is Seating
          </label>
          <input v-model="packageForm.benefits" type="text" class="form-input" placeholder="benefits" />
          <input v-model.number="packageForm.extraFeeInProcent" type="number" class="form-control" min="0" />
          <label>extra fee in %</label>
          <button type="submit" class="submit-button">Save Package</button>
        </form>
      </div>
      <div class="card-wrapper" v-for="item in eventData?.packages" :key="item.id">
        <div class="card-content">
          <div>
            <p><strong>{{ item.name }}</strong></p>
            <p>Seating: {{ item.isSeating }}</p>
            <p>Benefits: {{ item.benefits }}</p>
            <p>Extra Fee: {{ item.extraFeeInProcent }}%</p>
          </div>
          <div class="button-group">
            <button class="btn btn-primary">Edit</button>
            <button class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 24px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}
</style>

