<script setup lang="ts">
import { inject, ref } from 'vue';
import type { IEventForm } from '../../Interfaces/IEventForm';
import Modal from '../../components/Modal.vue';
import { useTokenManager } from '../../Composables/UseTokenManager';

    const eventUrl = inject("EventServiceUrl")
    const tokenManager = useTokenManager()
    const message = ref('')
    const showModal = ref(false)
    const eventForm = ref<IEventForm>({
        imageFile: null,
        name: "",
        description: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        totalTickets: 1,
        price: 0,
        categoryId: null
    })

    const AddEventAsync = async () => {
        const formData = new FormData();
          if (eventForm.value.imageFile) {
            formData.append("imageFile", eventForm.value.imageFile);
        }

        formData.append("name", eventForm.value.name);
        formData.append("description", eventForm.value.description);
        formData.append("location", eventForm.value.location);
        formData.append("date", eventForm.value.date);
        formData.append("startTime", eventForm.value.startTime);
        formData.append("endTime", eventForm.value.endTime);
        formData.append("totalTickets", eventForm.value.totalTickets.toString());
        formData.append("price", eventForm.value.price.toString());

        if (eventForm.value.categoryId !== null) {
            formData.append("categoryId", eventForm.value.categoryId.toString());
        }
        try {
            const res = await fetch(`${eventUrl}/events`, {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": `Bearer ${tokenManager.getToken()}`
            }
            });
            if (res.status === 401) {
              
              return;
            }

            if (!res.ok) {
            message.value = await res.text();
            } else {
              message.value = "Successfully added event"
            }
            showModal.value = true
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;

        if (files && files.length > 0) {
            eventForm.value.imageFile = files[0];
        } else {
            eventForm.value.imageFile = null;
        }
    };
</script>

<template>
  <Modal :message="message" :show="showModal"/>
  <div class="form-container">
    <h2 class="form-title">Add Event</h2>
    <form @submit.prevent="AddEventAsync" class="form" enctype="multipart/form-data">
      <input name="imageFile" type="file" @change="handleFileChange" />
      <input v-model.trim="eventForm.name" type="text" name="name" class="form-input" placeholder="name"/>
      <input v-model.trim="eventForm.description" type="text" name="description" class="form-input" placeholder="description"/>
      <input v-model.trim="eventForm.date" type="date" name="date" class="form-input"/>
      <input v-model.trim="eventForm.startTime" type="text" name="startTime" class="form-input" placeholder="10:00"/>
      <input v-model.trim="eventForm.endTime" type="text" name="endTime" class="form-input" placeholder="12:00"/>
      <input v-model.trim="eventForm.location" type="text" name="location" class="form-input" placeholder="location"/>
      <label>
        Total Tickets
      <input v-model.trim="eventForm.totalTickets" type="number" name="totalTickets" class="form-input"/>
      </label>
      <label>
        Price per ticket
      <input v-model.trim="eventForm.price" type="number" name="price" class="form-input"/>
      </label>
      <button type="submit" class="submit-button">Add Event</button>
    </form>
  </div>
</template>