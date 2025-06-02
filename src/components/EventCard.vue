<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

defineProps<{
  event: {
    id: number,
    name: string
    date: string
    location: string
    price: number
    categoryName: string | null
    imageUrl: string
  }
}>()

const viewDetails = (id: number) => {
  router.push({path: `events/${id}`})
}
</script>

<template>
  <div class="event-card" @click="viewDetails(event.id)">
    <div class="image-container">
      <img :src="event.imageUrl" alt="Event Image" class="event-image" />
      <span class="category-tag">{{ event.categoryName }}</span>
    </div>
    <div class="event-details">
      <h2 class="event-name">{{ event.name }}</h2>
      <p class="event-description">{{ event.location }}</p>
      <div class="event-meta">
        <span class="location">{{ event.date.split('T')[0] }}</span>
        <span class="price">${{ event.price.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-card {
  max-width: 350px;
  background-color: var(--gray-10);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: sans-serif;
  transition: transform 0.2s ease;
}
.event-card:hover {
  transform: translateY(-4px);
}
.image-container {
  position: relative;
}
.event-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: var(--gray-10);
  color: var(--secondary-100);
  padding: 4px 12px;
  border-radius: 1000px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.event-details {
  padding: 16px;
}
.event-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.event-description {
  font-size: 14px;
  color: var(--gray-100);
  margin-bottom: 12px;
}
.event-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--gray-100);
}

.price {
  font-weight: bold;
  color: var(--primary-100);
}
</style>