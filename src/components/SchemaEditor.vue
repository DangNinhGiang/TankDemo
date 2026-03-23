<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'validate', 'error'])

const schemaText = ref(props.modelValue)
const error = ref(null)
const textareaRef = ref(null)
const lineNumbersRef = ref(null)

// Đồng bộ 2 chiều với v-model
watch(() => props.modelValue, v => (schemaText.value = v))
watch(schemaText, v => {
    emit('update:modelValue', v)
    error.value = null
})

function validateSchema() {
    try {
        JSON.parse(schemaText.value)
        error.value = null
        emit('validate')
        return true
    } catch (e) {
        error.value = e.message
        emit('error', e.message)
        return false
    }
}

function formatJSON() {
    try {
        const parsed = JSON.parse(schemaText.value)
        schemaText.value = JSON.stringify(parsed, null, 2)
        error.value = null
    } catch (e) {
        error.value = e.message
    }
}

const lineCount = computed(() => schemaText.value.split('\n').length)

function syncScroll(event) {
    if (lineNumbersRef.value) {
        lineNumbersRef.value.scrollTop = event.target.scrollTop
    }
}

// Export function để cha có thể gọi trực tiếp nếu cần
defineExpose({ validateSchema, formatJSON })
</script>

<template>
    <div class="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                    JSON Schema Editor
                </h3>
                <div class="flex gap-2">
                    <button @click="formatJSON"
                        class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                            </path>
                        </svg>
                        Format
                    </button>
                    <button @click="validateSchema"
                        class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Validate
                    </button>
                </div>
            </div>
        </div>

        <!-- Editor Area -->
        <div class="p-6">
            <div class="relative h-96 overflow-hidden">
                <textarea v-model="schemaText" spellcheck="false" ref="textareaRef" @scroll="syncScroll"
                    class="w-full h-full pl-16 pr-4 pt-4 pb-4 border-2 border-gray-200 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-gray-50/50 hover:bg-white resize-none overflow-y-auto"
                    :class="error ? 'border-red-400 bg-red-50/30' : 'border-gray-300'"
                    placeholder="Paste your JSON Schema here..." />

                <!-- Line Numbers -->
                <div
                    class="absolute left-0 top-0 h-96 w-14 bg-gray-100/80 border-r border-gray-200 rounded-l-2xl overflow-hidden pointer-events-none">
                    <div ref="lineNumbersRef" class="h-full overflow-y-auto">
                        <div v-for="n in lineCount" :key="n"
                            class="text-xs text-gray-500 text-right px-3 py-0 leading-6 font-mono h-6">
                            {{ n }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mt-4 p-4 bg-red-50/80 border border-red-200/60 rounded-xl">
                <div class="flex items-start gap-3">
                    <svg class="w-3 h-3 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm font-semibold text-red-700">JSON Validation Error</p>
                        <p class="text-sm text-red-600 mt-1">{{ error }}</p>
                    </div>
                </div>
            </div>

            <!-- Success Message -->
            <div v-else-if="schemaText && schemaText.length > 10"
                class="mt-4 p-4 bg-emerald-50/80 border border-emerald-200/60 rounded-xl">
                <div class="flex items-center gap-3">
                    <svg class="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-sm font-semibold text-emerald-700">JSON Schema is valid</p>
                </div>
            </div>

            <!-- Info Message -->
            <div class="mt-4 p-4 bg-blue-50/80 border border-blue-200/60 rounded-xl">
                <div class="flex items-start gap-3">
                    <svg class="w-3 h-3 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm font-semibold text-blue-700">JSON Schema with Faker keywords supported</p>
                        <p class="text-sm text-blue-600 mt-1">Use properties like "faker": "name.firstName" to
                            generate realistic data</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>