<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { useFetch } from '../Composables/useFetch';
import type { IEvent } from '../Interfaces/IEvent';
import EventCard from '../components/EventCard.vue';
const eventUrl = inject('EventServiceUrl')
const { data, error, loading, fetch } =  useFetch<IEvent[]>(`${eventUrl}/events`)

onMounted(async () => {
    await fetch
})
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
        <EventCard
            :event="{
                id: item.id,
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
    padding: 20px;
    margin-bottom: 10px;
    gap: 10px;
    justify-content: center;
    @media(min-width: 920px) {
        display: flex;
        justify-content: start;
        flex-wrap: wrap;
    }
}
</style>