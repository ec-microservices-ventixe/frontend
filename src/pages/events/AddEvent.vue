<script setup lang="ts">
import { ref } from 'vue';
import type { IEventForm } from '../../Interfaces/IEventForm';

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
            const res = await fetch('https://ventixe-event-service-cjebcpbnf0ejcnbw.swedencentral-01.azurewebsites.net/events', {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken") || ''}`
            }
            });
            if (res.status === 401) {
            console.error("Unauthorized")
            return;
            }

            if (!res.ok) {
            const errText = await res.text();
            console.error(errText);
            return;
            }
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