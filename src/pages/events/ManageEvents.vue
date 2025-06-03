<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { useFetch } from '../../Composables/useFetch';
import type { IEvent } from '../../Interfaces/IEvent';
import EventPackagesModal from '../../components/EventPackagesModal.vue';
import { useRouter } from 'vue-router';
import Modal from '../../components/Modal.vue';

const router = useRouter()
const baseUrl = inject("EventServiceUrl");
const { data, error, loading, fetch: fetchData } = useFetch<IEvent[]>(`${baseUrl}/events`);

const showMsgModal = ref(false)
const message = ref('')
const showPackagesModal = ref(false);
const currentItemId = ref(0);
const managePackages = (id: number) => {
  currentItemId.value = id;
  showPackagesModal.value = true;
};
const closePackagesModal = () => {
  showPackagesModal.value = false;
};
onMounted(async () => {
  await fetchData
});

const routeToEditPage = (id: number) => {
  router.push({path: `/events/update/${id}`})
}
const deleteEvent = async (id: number) => {
  const res = await fetch(`${baseUrl}/events/${id}`, {method: 'DELETE'})
  if(res.ok) {
    message.value = "Successfully deleted event"
  } else {
    message.value = await res.text()
  }
  showMsgModal.value = true
}
</script>

<template>
  <Modal :message="message" :show="showMsgModal"/>
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
          <button class="btn btn-primary" @click="routeToEditPage(item.id)">Edit</button>
          <button class="btn btn-primary" @click="deleteEvent(item.id)">Delete</button>
          <button class="btn btn-primary" @click="managePackages(item.id)">Packages</button>
        </div>
      </div>
    </div>
  </div>

  <EventPackagesModal
    :event-id="currentItemId"
    :show="showPackagesModal"
    @close="closePackagesModal"
  />
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