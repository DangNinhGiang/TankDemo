<template>
    <div class="grid grid-cols-[1.2fr_1fr] h-96 border border-gray-300 bg-gray-50 font-mono text-sm">

        <!-- LEFT: LOG LIST -->
        <div ref="logContainer" class="overflow-y-auto border-r border-gray-300 p-2 space-y-1">
            <div v-for="(log, index) in logs" :key="index" @click="selectLog(log)" class="cursor-pointer rounded px-2 py-1 flex gap-2 items-start
               hover:bg-gray-200 transition" :class="{
                'bg-blue-100': selectedLog === log,
            }">
                <span class="text-gray-500 shrink-0">
                    [{{ log.time }}]
                </span>

                <span class="font-bold shrink-0" :class="levelColor(log.level)">
                    {{ log.level.toUpperCase() }}
                </span>

                <span class="text-gray-800 truncate">
                    {{ log.message }}
                </span>
            </div>
        </div>

        <!-- RIGHT: LOG DETAIL -->
        <div class="overflow-auto p-3 bg-white">
            <pre v-if="selectedLog" class="text-xs leading-relaxed text-gray-800">
{{ formatJSON(selectedLog.data || selectedLog) }}
      </pre>
            <div v-else class="h-full flex items-center justify-center text-gray-400 italic">
                Select a log to view details
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
    logs: {
        type: Array,
        required: true
    }
})

const selectedLog = ref(null)
const logContainer = ref(null)

function selectLog(log) {
    selectedLog.value = log
}

function formatJSON(data) {
    return JSON.stringify(data, null, 2)
}

function levelColor(level) {
    switch (level) {
        case 'info':
            return 'text-blue-600'
        case 'warn':
            return 'text-yellow-600'
        case 'error':
            return 'text-red-600'
        default:
            return 'text-gray-600'
    }
}

/* Auto scroll when new logs arrive */
watch(
    () => props.logs.length,
    async () => {
        await nextTick()
        if (logContainer.value) {
            logContainer.value.scrollTop =
                logContainer.value.scrollHeight
        }
    }
)
</script>
