<template>
    <div class="space-y-3">

        <!-- HEADER -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="px-2 py-0.5 rounded text-xs font-semibold" :class="statusClass">
                    {{ status }}
                </span>

                <span class="text-sm text-gray-700">
                    {{ inserted }} / {{ total }} records
                </span>
            </div>

            <span class="text-sm text-gray-500">
                {{ percent }}
            </span>
        </div>

        <!-- BAR -->
        <div class="w-full h-3 bg-gray-200 rounded overflow-hidden">
            <div class="h-full transition-all duration-300" :class="barColor" :style="{ width: percent + '%' }" />
        </div>

        <!-- FOOTER -->
        <div class="flex justify-between text-xs text-gray-500">
            <span>
                Throughput: <b>{{ throughput }}</b> rec/s
            </span>
            <span v-if="eta">
                ETA: {{ eta }}
            </span>
        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    inserted: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    throughput: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'RUNNING'
    }
})

const percent = computed(() => {
    if (props.total === 0) return 0
    return Math.min(
        100,
        Math.floor((props.inserted / props.total) * 100)
    )
})

const barColor = computed(() => {
    switch (props.status) {
        case 'COMPLETED':
            return 'bg-green-500'
        case 'FAILED':
            return 'bg-red-500'
        case 'STOPPED':
            return 'bg-yellow-500'
        default:
            return 'bg-blue-500'
    }
})

const statusClass = computed(() => {
    switch (props.status) {
        case 'COMPLETED':
            return 'bg-green-100 text-green-700'
        case 'FAILED':
            return 'bg-red-100 text-red-700'
        case 'STOPPED':
            return 'bg-yellow-100 text-yellow-700'
        default:
            return 'bg-blue-100 text-blue-700'
    }
})

const eta = computed(() => {
    if (!props.throughput || props.inserted === 0) return null
    const remaining = props.total - props.inserted
    const seconds = Math.ceil(remaining / props.throughput)
    if (seconds < 60) return `${seconds}s`
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
})
</script>
