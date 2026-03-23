<template>
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
           text-xs font-semibold select-none" :class="badgeClass">
        <!-- Dot -->
        <span class="w-2 h-2 rounded-full" :class="dotClass" />

        {{ label }}
    </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    status: {
        type: String,
        required: true
    }
})

const label = computed(() => props.status.toUpperCase())

const badgeClass = computed(() => {
    switch (props.status) {
        case 'RUNNING':
            return 'bg-blue-100 text-blue-700'
        case 'COMPLETED':
            return 'bg-green-100 text-green-700'
        case 'STOPPED':
            return 'bg-yellow-100 text-yellow-700'
        case 'PAUSED':
            return 'bg-yellow-100 text-yellow-700'
        case 'FAILED':
            return 'bg-red-100 text-red-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
})

const dotClass = computed(() => {
    switch (props.status) {
        case 'RUNNING':
            return 'bg-blue-500 animate-pulse'
        case 'COMPLETED':
            return 'bg-green-500'
        case 'STOPPED':
            return 'bg-yellow-500'
        case 'PAUSED':
            return 'bg-yellow-500'
        case 'FAILED':
            return 'bg-red-500'
        default:
            return 'bg-gray-400'
    }
})
</script>
