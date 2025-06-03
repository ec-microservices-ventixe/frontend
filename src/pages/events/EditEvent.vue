<script setup lang="ts">
    import { inject, onMounted, reactive } from 'vue';
    import { useRoute } from 'vue-router';
    import { useFetch } from '../../Composables/useFetch';
    import type { IEvent } from '../../Interfaces/IEvent';
import type { IEventUpdateForm } from '../../Interfaces/IEventForm';
    const eventUrl = inject("EventServiceUrl")
    const route = useRoute()
    const {data: eventData, error: eventError, loading: eventLoading, fetch: fetchEvent} = useFetch<IEvent>(`${eventUrl}/events/${route.params.id}`)

    const eventForm = reactive<IEventUpdateForm>({
        id: 0,
        imageUrl: null,
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

    onMounted(async () => {
        await fetchEvent
          if (eventData.value) {
            eventForm.id = eventData.value.id;
            eventForm.imageUrl = eventData.value.imageUrl;
            eventForm.name = eventData.value.name;
            eventForm.description = eventData.value.description;
            eventForm.location = eventData.value.location;
            eventForm.date = eventData.value.date;
            eventForm.startTime = eventData.value.startTime.substring(0, eventData.value.startTime.lastIndexOf(':'));
            eventForm.endTime = eventData.value.endTime.substring(0, eventData.value.endTime.lastIndexOf(':'));
            eventForm.totalTickets = eventData.value.totalTickets;
            eventForm.price = eventData.value.price;
            eventForm.categoryId = eventData.value.category.id;
        }
    })

    const AddEventAsync = async () => {
        const formData = new FormData();
          if (eventForm.imageFile) {
            formData.append("imageFile", eventForm.imageFile);
        }

        formData.append("name", eventForm.name);
        formData.append("description", eventForm.description);
        formData.append("location", eventForm.location);
        formData.append("date", eventForm.date);
        formData.append("startTime", eventForm.startTime);
        formData.append("endTime", eventForm.endTime);
        formData.append("totalTickets", eventForm.totalTickets.toString());
        formData.append("price", eventForm.price.toString());

        if (eventForm.categoryId !== null) {
            formData.append("categoryId", eventForm.categoryId.toString());
        }
        try {
            const res = await fetch(`https://ventixe-event-service-cjebcpbnf0ejcnbw.swedencentral-01.azurewebsites.net/events/${route.params.id}`, {
            method: 'PUT',
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
        } catch (error) {
            console.error(error);
        }
        console.log("success")
    }

    const handleFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;

        if (files && files.length > 0) {
            eventForm.imageFile = files[0];
            eventForm.imageUrl = URL.createObjectURL(files[0])
             console.log("Image URL:", eventForm.imageUrl);
        } else {
            eventForm.imageFile = null;
        }
    };
</script>

<template>
  <div v-if="eventLoading">...Loading Event Details</div>
  <div v-if="eventError">...Could not get the event details</div>
  <div v-if="eventData" class="form-container">
    <h2 class="form-title">Add Event</h2>
    <form @submit.prevent="AddEventAsync" class="form" enctype="multipart/form-data">
      <img v-if="eventForm.imageUrl" :src="eventForm.imageUrl" />
      <input name="imageFile" type="file" @change="handleFileChange" />
      <input v-model.trim="eventForm.name" type="text" name="name" class="form-input" placeholder="name"/>
      <textarea v-model.trim="eventForm.description" type="text" name="description" class="form-input" placeholder="description"></textarea>
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
      <button type="submit" class="submit-button">Update Event</button>
    </form>
  </div>
</template>