<script setup lang="ts">
    defineProps<{
    message: string;
    show: boolean
    }>()
    const emits = defineEmits(['close'])
</script>

<template>
    <div v-if="show" class="modal">
        <p class="modal-msg">{{ message }}</p>
        <button @click="$emit('close')" class="btn btn-primary">close</button>
    </div>
</template>

<style scoped>
    .modal {
        justify-self: center;
        width: 320px;
        height: 72px;
        background-color: var(--primary-50);
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>