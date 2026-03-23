<script setup>
import { reactive, watch, ref, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:modelValue', 'submit'])

// State cho việc collapse/expand
const isExpanded = ref(false)
const showAdvanced = ref(false)
const showDeveloper = ref(false)

// Sử dụng local state để binding, đồng bộ ngược lại props
const options = reactive({
    patternProperties: { enabled: false, strategy: 'merge', patterns: {} },
    ...props.modelValue
})

// Computed property để export/import config
const configJSON = computed(() => JSON.stringify(options, null, 2))

// Normalize seed handling
const normalizedSeed = computed({
    get: () => options.seed || options.faker?.seed || null,
    set: (value) => {
        options.seed = value
        if (options.faker) options.faker.seed = value
    }
})

// Normalize value resolution strategy
const valueResolutionStrategy = computed({
    get: () => {
        if (options.useExamplesValue) return 'example'
        if (options.useDefaultValue) return 'default'
        return 'random'
    },
    set: (value) => {
        options.useExamplesValue = value === 'example'
        options.useDefaultValue = value === 'default'
    }
})

watch(options, (newVal) => {
    emit('update:modelValue', { ...newVal })
}, { deep: true })

function submit() {
    emit('submit', { ...options })
}

function toggleExpanded() {
    isExpanded.value = !isExpanded.value
}

function importConfig(event) {
    try {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const imported = JSON.parse(e.target.result)
                Object.assign(options, normalizeImportedConfig(imported))
            }
            reader.readAsText(file)
        }
    } catch {
        alert('Invalid configuration file')
    }
}

function exportConfig() {
    const blob = new Blob([configJSON.value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'jsf-config.json'
    a.click()
    URL.revokeObjectURL(url)
}

function normalizeImportedConfig(config) {
    // Normalize seed handling
    if (config.faker?.seed || config.seed) {
        config.seed = config.faker?.seed || config.seed
        if (config.faker) delete config.faker.seed
    }

    // Normalize value resolution
    if (config.useExamplesValue || config.useDefaultValue) {
        // Keep existing logic for backward compatibility
    }

    return config
}

function resetToDefaults() {
    Object.assign(options, {
        // Basic Options
        defaultRandExpMax: 10,
        optionProbability: 0.5,
        minItems: 0,
        maxItems: 10,
        minLength: 0,
        maxLength: 100,

        // Object Constraints (NEW)
        minProperties: 0,
        maxProperties: 20,

        // Error Handling
        defaultInvalidType: 'null',
        pruneProperties: '',
        ignoreProperties: '',
        ignoreMissingRefs: false,
        failOnInvalidTypes: true,
        failOnInvalidFormat: true,
        alwaysFakeOptionals: false,
        refDepthMax: 5,

        // Probability Controls (Normalized)
        fixedProbability: false,
        fixedProbabilityValue: 0.5,

        // Value Resolution Strategy (Normalized)
        useExamplesValue: false,
        useDefaultValue: false,

        // Null & Optional Handling
        requiredOnly: false,
        omitNulls: false,
        replaceEmptyByRandomValue: false,

        // Array & Object Controls
        uniqueItems: false,
        additionalProperties: true,
        sortProperties: true,
        resolveJsonPath: true,
        reuseProperties: true,
        fillProperties: true,

        // Pattern Properties (NEW)
        patternProperties: {
            enabled: true,
            strategy: 'override', // 'merge' or 'override'
            patterns: {
                "^[a-z]+$": {
                    type: "string",
                    format: "email"
                }
            }
        },

        // Date & Time
        minDateTime: '2020-01-01',
        maxDateTime: '2030-12-31',
        timeOffset: 0,

        // Faker & Chance Integration
        faker: {
            locale: 'en',
            seed: null
        },
        chance: {
            guid: true,
            name: true,
            email: true
        },
        regex: {
            enabled: true,
            minLength: 1,
            maxLength: 50
        },

        // UI Rendering
        renderTitle: true,
        renderDescription: true,
        renderComment: false,
        hideInternalProps: false,

        // Debug & Development
        debug: false,
        seedReset: true,
        strictSchema: true,

        // Normalized Seed Handling
        seed: null,
        seedStrategy: 'global', // 'global' or 'faker-only'

        // Legacy compatibility
        random: ''
    })
}
</script>

<template>
    <div class="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-xl overflow-hidden">
        <!-- Header với nút cài đặt -->
        <div class="bg-linear-to-r from-purple-600 to-pink-600 px-6 py-4 border-b border-gray-200/60">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-white/20 rounded-xl">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4">
                            </path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-white">Generation Options</h3>
                        <p class="text-sm text-white/80">Cấu hình tùy chọn tạo dữ liệu</p>
                    </div>
                </div>
                <button @click="toggleExpanded"
                    class="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm">
                    <svg class="w-5 h-5 text-white transition-transform duration-200"
                        :class="{ 'rotate-180': isExpanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                    <span class="font-medium text-white">Cài đặt</span>
                </button>
            </div>
        </div>

        <!-- Collapsible content -->
        <div v-show="isExpanded" class="p-6 space-y-6">
            <!-- Configuration Actions -->
            <div class="flex gap-3 justify-end">
                <button @click="resetToDefaults"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all text-sm font-medium">
                    Reset Defaults
                </button>
                <label
                    class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all text-sm font-medium cursor-pointer">
                    Import Config
                    <input type="file" @change="importConfig" accept=".json" class="hidden" />
                </label>
                <button @click="exportConfig"
                    class="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all text-sm font-medium">
                    Export Config
                </button>
            </div>

            <!-- Basic Options -->
            <div class="space-y-4">
                <h4 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4">
                        </path>
                    </svg>
                    Basic Options
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        class="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl p-4 space-y-2">
                        <label
                            class="block text-sm font-bold text-blue-700 uppercase tracking-wide">defaultRandExpMax</label>
                        <input type="number" v-model.number="options.defaultRandExpMax"
                            class="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80" />
                        <p class="text-xs text-blue-600">Maximum value for random expressions</p>
                    </div>

                    <div
                        class="bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-xl p-4 space-y-2">
                        <label
                            class="block text-sm font-bold text-emerald-700 uppercase tracking-wide">optionProbability</label>
                        <input type="number" step="0.1" min="0" max="1" v-model.number="options.optionProbability"
                            class="w-full border-2 border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white/80" />
                        <p class="text-xs text-emerald-600">Probability for optional fields (0-1)</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        class="bg-linear-to-br from-orange-50 to-amber-50 border border-orange-200/60 rounded-xl p-4 space-y-2">
                        <label class="block text-sm font-bold text-orange-700 uppercase tracking-wide">minItems</label>
                        <input type="number" v-model.number="options.minItems"
                            class="w-full border-2 border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-white/80" />
                        <p class="text-xs text-orange-600">Minimum items in arrays</p>
                    </div>
                    
                    <div
                        class="bg-linear-to-br from-rose-50 to-pink-50 border border-rose-200/60 rounded-xl p-4 space-y-2">
                        <label class="block text-sm font-bold text-rose-700 uppercase tracking-wide">maxItems</label>
                        <input type="number" v-model.number="options.maxItems"
                            class="w-full border-2 border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 bg-white/80" />
                        <p class="text-xs text-rose-600">Maximum items in arrays</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        class="bg-linear-to-br from-violet-50 to-purple-50 border border-violet-200/60 rounded-xl p-4 space-y-2">
                        <label class="block text-sm font-bold text-violet-700 uppercase tracking-wide">minLength</label>
                        <input type="number" v-model.number="options.minLength"
                            class="w-full border-2 border-violet-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 bg-white/80" />
                        <p class="text-xs text-violet-600">Minimum string length</p>
                    </div>

                    <div
                        class="bg-linear-to-br from-cyan-50 to-blue-50 border border-cyan-200/60 rounded-xl p-4 space-y-2">
                        <label class="block text-sm font-bold text-cyan-700 uppercase tracking-wide">maxLength</label>
                        <input type="number" v-model.number="options.maxLength"
                            class="w-full border-2 border-cyan-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 bg-white/80" />
                        <p class="text-xs text-cyan-600">Maximum string length</p>
                    </div>
                </div>
            </div>

            <!-- Advanced Options -->
            <div class="space-y-4">
                <button @click="showAdvanced = !showAdvanced"
                    class="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
                    <h4 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                            </path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Advanced Options
                    </h4>
                    <svg class="w-5 h-5 text-gray-500 transition-transform duration-200"
                        :class="{ 'rotate-180': showAdvanced }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <div v-show="showAdvanced" class="space-y-4">
                    <!-- Error Handling -->
                    <div class="bg-red-50 border border-red-200/60 rounded-xl p-4">
                        <h5 class="text-sm font-bold text-red-700 uppercase tracking-wide mb-3">Error Handling</h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-red-600">defaultInvalidType</label>
                                <input type="text" v-model="options.defaultInvalidType"
                                    placeholder="e.g. string, number"
                                    class="w-full border border-red-200 rounded px-3 py-2 text-sm bg-white" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-red-600">pruneProperties</label>
                                <input type="text" v-model="options.pruneProperties" placeholder="comma-separated"
                                    class="w-full border border-red-200 rounded px-3 py-2 text-sm bg-white" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-red-600">ignoreProperties</label>
                                <input type="text" v-model="options.ignoreProperties" placeholder="comma-separated"
                                    class="w-full border border-red-200 rounded px-3 py-2 text-sm bg-white" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-red-600">refDepthMax</label>
                                <input type="number" v-model.number="options.refDepthMax"
                                    class="w-full border border-red-200 rounded px-3 py-2 text-sm bg-white" />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.ignoreMissingRefs" class="rounded" />
                                ignoreMissingRefs
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.failOnInvalidTypes" class="rounded" />
                                failOnInvalidTypes
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.failOnInvalidFormat" class="rounded" />
                                failOnInvalidFormat
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.alwaysFakeOptionals" class="rounded" />
                                alwaysFakeOptionals
                            </label>
                        </div>
                    </div>

                    <!-- Null & Optional Handling -->
                    <div class="bg-amber-50 border border-amber-200/60 rounded-xl p-4">
                        <h5 class="text-sm font-bold text-amber-700 uppercase tracking-wide mb-3">Null & Optional
                            Handling</h5>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.omitNulls" class="rounded" />
                                omitNulls
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.requiredOnly" class="rounded" />
                                requiredOnly
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.useExamplesValue" class="rounded" />
                                useExamplesValue
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.replaceEmptyByRandomValue" class="rounded" />
                                replaceEmptyByRandom
                            </label>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-amber-600">Value Resolution Strategy</label>
                                <select v-model="valueResolutionStrategy"
                                    class="w-full border border-amber-200 rounded px-3 py-2 text-sm bg-white">
                                    <option value="random">Random</option>
                                    <option value="example">Example First</option>
                                    <option value="default">Default First</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-amber-600">fixedProbability</label>
                                <div class="flex gap-2">
                                    <input type="checkbox" v-model="options.fixedProbability" class="rounded" />
                                    <input type="number" step="0.1" min="0" max="1"
                                        v-model.number="options.fixedProbabilityValue"
                                        class="flex-1 border border-amber-200 rounded px-3 py-2 text-sm bg-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Object Constraints -->
                    <div class="bg-indigo-50 border border-indigo-200/60 rounded-xl p-4">
                        <h5 class="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-3">Object Constraints
                        </h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-indigo-600">minProperties</label>
                                <input type="number" v-model.number="options.minProperties"
                                    class="w-full border border-indigo-200 rounded px-3 py-2 text-sm bg-white" />
                                <p class="text-xs text-indigo-600">Minimum properties in objects</p>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-indigo-600">maxProperties</label>
                                <input type="number" v-model.number="options.maxProperties"
                                    class="w-full border border-indigo-200 rounded px-3 py-2 text-sm bg-white" />
                                <p class="text-xs text-indigo-600">Maximum properties in objects</p>
                            </div>
                        </div>
                    </div>

                    <!-- Pattern Properties -->
                    <div class="bg-purple-50 border border-purple-200/60 rounded-xl p-4">
                        <h5 class="text-sm font-bold text-purple-700 uppercase tracking-wide mb-3">Pattern Properties
                        </h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="flex items-center gap-2 text-xs">
                                    <input type="checkbox" v-model="options.patternProperties.enabled"
                                        class="rounded" />
                                    Enable Pattern Properties
                                </label>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-purple-600">Strategy</label>
                                <select v-model="options.patternProperties.strategy"
                                    class="w-full border border-purple-200 rounded px-3 py-2 text-sm bg-white">
                                    <option value="merge">Merge</option>
                                    <option value="override">Override</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Array & Object Controls -->
                    <div class="bg-blue-50 border border-blue-200/60 rounded-xl p-4">
                        <h5 class="text-sm font-bold text-blue-700 uppercase tracking-wide mb-3">Array & Object Controls
                        </h5>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.uniqueItems" class="rounded" />
                                uniqueItems
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.additionalProperties" class="rounded" />
                                additionalProperties
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.sortProperties" class="rounded" />
                                sortProperties
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.resolveJsonPath" class="rounded" />
                                resolveJsonPath
                            </label>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.reuseProperties" class="rounded" />
                                reuseProperties
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.fillProperties" class="rounded" />
                                fillProperties
                            </label>
                        </div>
                    </div>

                    <!-- Date & Time -->
                    <div class="bg-purple-50 border border-purple-200/60 rounded-xl p-4">
                        <h5 class="text-sm font-bold text-purple-700 uppercase tracking-wide mb-3">Date & Time</h5>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-purple-600">minDateTime</label>
                                <input type="date" v-model="options.minDateTime"
                                    class="w-full border border-purple-200 rounded px-3 py-2 text-sm bg-white" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-purple-600">maxDateTime</label>
                                <input type="date" v-model="options.maxDateTime"
                                    class="w-full border border-purple-200 rounded px-3 py-2 text-sm bg-white" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-purple-600">timeOffset</label>
                                <input type="number" v-model.number="options.timeOffset"
                                    class="w-full border border-purple-200 rounded px-3 py-2 text-sm bg-white" />
                            </div>
                        </div>
                    </div>

                    <!-- Faker & Chance Integration -->
                    <div class="bg-green-50 border border-green-200/60 rounded-xl p-4">
                        <h5 class="text-sm font-bold text-green-700 uppercase tracking-wide mb-3">Faker & Chance
                            Integration</h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-green-600">faker.locale</label>
                                <select v-model="options.faker.locale"
                                    class="w-full border border-green-200 rounded px-3 py-2 text-sm bg-white">
                                    <option value="en">English</option>
                                    <option value="vi">Vietnamese</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="ja">Japanese</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-green-600">faker.seed</label>
                                <input type="text" v-model="normalizedSeed" placeholder="null for random"
                                    class="w-full border border-green-200 rounded px-3 py-2 text-sm bg-white" />
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-3 mt-3">
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.chance.guid" class="rounded" />
                                chance.guid
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.chance.name" class="rounded" />
                                chance.name
                            </label>
                            <label class="flex items-center gap-2 text-xs">
                                <input type="checkbox" v-model="options.chance.email" class="rounded" />
                                chance.email
                            </label>
                        </div>
                    </div>

                    <!-- Regex & Pattern -->
                    <div class="bg-indigo-50 border border-indigo-200/60 rounded-xl p-4">
                        <h5 class="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-3">Regex & Pattern</h5>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="space-y-2">
                                <label class="flex items-center gap-2 text-xs">
                                    <input type="checkbox" v-model="options.regex.enabled" class="rounded" />
                                    Enable Regex
                                </label>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-indigo-600">regex.minLength</label>
                                <input type="number" v-model.number="options.regex.minLength"
                                    class="w-full border border-indigo-200 rounded px-3 py-2 text-sm bg-white" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-indigo-600">regex.maxLength</label>
                                <input type="number" v-model.number="options.regex.maxLength"
                                    class="w-full border border-indigo-200 rounded px-3 py-2 text-sm bg-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Developer Options -->
            <div class="space-y-4">
                <button @click="showDeveloper = !showDeveloper"
                    class="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 rounded-xl transition-all">
                    <h4 class="text-lg font-bold text-white flex items-center gap-2">
                        <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                            </path>
                        </svg>
                        Developer Options
                    </h4>
                    <svg class="w-5 h-5 text-gray-400 transition-transform duration-200"
                        :class="{ 'rotate-180': showDeveloper }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <div v-show="showDeveloper" class="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-4">
                    <!-- Seed Management -->
                    <div>
                        <h5 class="text-sm font-bold text-gray-300 uppercase tracking-wide mb-3">Seed Management</h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-gray-300">Global Seed</label>
                                <input type="text" v-model="options.seed" placeholder="null for random"
                                    class="w-full border border-gray-600 rounded px-3 py-2 text-sm bg-gray-800 text-gray-200" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-gray-300">Seed Strategy</label>
                                <select v-model="options.seedStrategy"
                                    class="w-full border border-gray-600 rounded px-3 py-2 text-sm bg-gray-800 text-gray-200">
                                    <option value="global">Global</option>
                                    <option value="faker-only">Faker Only</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- UI Rendering -->
                    <div>
                        <h5 class="text-sm font-bold text-gray-300 uppercase tracking-wide mb-3">UI Rendering</h5>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <label class="flex items-center gap-2 text-xs text-gray-300">
                                <input type="checkbox" v-model="options.renderTitle" class="rounded" />
                                renderTitle
                            </label>
                            <label class="flex items-center gap-2 text-xs text-gray-300">
                                <input type="checkbox" v-model="options.renderDescription" class="rounded" />
                                renderDescription
                            </label>
                            <label class="flex items-center gap-2 text-xs text-gray-300">
                                <input type="checkbox" v-model="options.renderComment" class="rounded" />
                                renderComment
                            </label>
                            <label class="flex items-center gap-2 text-xs text-gray-300">
                                <input type="checkbox" v-model="options.hideInternalProps" class="rounded" />
                                hideInternalProps
                            </label>
                        </div>
                    </div>

                    <!-- Debug & Development -->
                    <div>
                        <h5 class="text-sm font-bold text-gray-300 uppercase tracking-wide mb-3">Debug & Development
                        </h5>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <label class="flex items-center gap-2 text-xs text-gray-300">
                                <input type="checkbox" v-model="options.debug" class="rounded" />
                                debug
                            </label>
                            <label class="flex items-center gap-2 text-xs text-gray-300">
                                <input type="checkbox" v-model="options.seedReset" class="rounded" />
                                seedReset
                            </label>
                            <label class="flex items-center gap-2 text-xs text-gray-300">
                                <input type="checkbox" v-model="options.strictSchema" class="rounded" />
                                strictSchema
                            </label>
                        </div>
                        <div class="mt-3 space-y-2">
                            <label class="text-xs font-medium text-gray-300">random (seed/expression)</label>
                            <input type="text" v-model="options.random" placeholder="Custom random seed or expression"
                                class="w-full border border-gray-600 rounded px-3 py-2 text-sm bg-gray-800 text-gray-200" />
                        </div>
                    </div>

                    <!-- Configuration Preview -->
                    <div>
                        <h5 class="text-sm font-bold text-gray-300 uppercase tracking-wide mb-3">Configuration Preview
                        </h5>
                        <pre
                            class="bg-gray-800 text-green-400 text-xs p-3 rounded-lg overflow-auto max-h-48">{{ configJSON }}</pre>
                    </div>
                </div>
            </div>

            <button @click="submit"
                class="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Apply Configuration
            </button>
        </div>
    </div>
</template>

<style scoped>
.input {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.4rem 0.6rem;
    font-size: 0.875rem;
}
</style>