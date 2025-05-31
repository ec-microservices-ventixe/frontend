<script setup lang="ts">
import { onMounted } from 'vue';
import { useFetch } from '../Composables/UseFetch.vue';
import type { IEvent } from '../Interfaces/IEvent';
import EventCard from '../components/EventCard.vue';
const { data, error, loading, fetch } =  useFetch<IEvent[]>("https://ventixe-event-service-cjebcpbnf0ejcnbw.swedencentral-01.azurewebsites.net/events")

onMounted(async () => {
    await fetch
    console.log(data.value)
})
</script>

<template>
    <div class="list-view">
        <div class="card-wrapper" v-for="item in data" :key="item.id">
        <EventCard
            :event="{
                name: item.name,
                date: item.date,
                location: item.location,
                price: item.price,
                categoryName: item.category?.name ?? 'other',
                imageUrl: item.imageUrl ?? '/images/default-image.webp'
            }"
                />
        </div>
    </div>
</template>

<style scoped>
.list-view {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
</style>