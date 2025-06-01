<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useFetch } from '../../Composables/UseFetch.vue';
import type { IEvent } from '../../Interfaces/IEvent';

const baseUrl = "https://ventixe-event-service-cjebcpbnf0ejcnbw.swedencentral-01.azurewebsites.net"
const { data, error, loading, fetch: fetchData } =  useFetch<IEvent[]>(`${baseUrl}/events`)
const currentItemId = ref(0)
const eventData = ref<IEvent | null | undefined>(null)
watch(
  currentItemId,
  async (newId) => {
    if (newId) {
      const { data, error, fetch } = useFetch<IEvent>(`${baseUrl}/events/${newId}`)
      await fetch
      if (!error.value) {
        eventData.value = data.value
      }
    } else {
      eventData.value = null
    }
  },
  { immediate: true }
)
onMounted(async () => {
    await fetchData
})
const showPackagesModal = ref(false)
const managePackages = async (id: number) => {
    currentItemId.value = id
    showPackagesModal.value = true
}
const closePackagesModal = () => {
    showPackagesModal.value = false;
}
const packageForm = ref({eventId: 0, name: '',isSeating: false,benefits: '', extraFeeInProcent: 0})

const addPackageAsync = async () => {
    packageForm.value.eventId = currentItemId.value
  try {
    const res = await fetch(`${baseUrl}/Controller`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken") || ''}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(packageForm.value)
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to save package:', errorData);
      return;
    }
    const data = await res.json()
    console.log(data)
    packageForm.value = {
      eventId: 0,
      name: '',
      isSeating: false,
      benefits: '',
      extraFeeInProcent: 0
    };
  } catch (err) {
    console.error('Error while saving package:', err);
  }
};
</script>
<template>
    <div class="list-view">
        <div v-if="loading">
            <p>Loading Events...</p>
        </div>
        <div v-if="error">
            <p>Sorry, we have some issues right now</p>
        </div>
        <div class="card-wrapper" v-for="item in data" :key="item.id">
            <div class="card-content">
                <h4>{{ item.name }}</h4>
                <div class="button-group">
                <button class="btn btn-primary" >Edit</button>
                <button class="btn btn-primary" >Delete</button>
                <button class="btn btn-primary" @click="managePackages(item.id)">Packages</button>
                </div>
            </div>
        </div>
    </div>

<div v-if="showPackagesModal" class="modal-backdrop">
  <div class="modal">
    <button class="btn btn-secondary mt-3" @click="closePackagesModal">Close</button>
    <div class="form-container">
        <h3 class="form-title">Manage Packages for Event: {{ eventData?.name }}</h3>
        <form class="form" @submit.prevent="addPackageAsync">
            <input v-model="packageForm.name" type="text" class="form-input" placeholder="name" />
            <label>
                <input v-model="packageForm.isSeating" type="checkbox" class="form-input"/>
                Is Seating
            </label>
            <input v-model="packageForm.benefits" type="text" class="form-input" placeholder="benefits"/>
            <input v-model.number="packageForm.extraFeeInProcent" type="number" class="form-control" min="0"/>
            <label>extra fee in %</label>
            <button type="submit" class="submit-button">Save Package</button>
        </form>
    </div>
    <div class="card-wrapper" v-for="item in eventData?.packages" :key="item.id">
      <div class="card-content">
        <div>
          <p><strong>{{ item.name }}</strong></p>
          <p>Seating: {{ item.isSeating ? 'Yes' : 'No' }}</p>
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
.card-wrapper {
  border: 1px solid var(--gray-20);
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 6px;
  background-color: var(--gray-10);
}
.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-content h4 {
  margin: 0;
  font-weight: 600;
}
.button-group button {
  margin-left: 8px;
  padding: 6px 12px;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
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