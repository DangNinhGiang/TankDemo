<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4">
                  </path>
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MongoDB Seeder
                </h1>
                <p class="text-sm text-gray-600 font-medium">Thiết lập cấu hình và kiểm tra dữ liệu mẫu trước khi chạy
                  Job</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="validateForm"
              class="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Kiểm tra JSON
            </button>
            <button @click="startJob(form.options)" :disabled="!isValid || isStarting"
              class="px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 transform hover:scale-105">
              <span v-if="isStarting" class="animate-spin"></span>
              <span v-else></span>
              {{ isStarting ? 'ĐANG KHỞI TẠO...' : 'CHẠY SEEDER' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-5 gap-8">

        <!-- Left Column - Connection & Schema -->
        <div class="xl:col-span-3 space-y-8">

          <!-- Connection Settings -->
          <div class="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-xl overflow-hidden">
            <div class="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z">
                  </path>
                </svg>
                Connection Settings
              </h3>
            </div>

            <div class="p-6 space-y-6">
              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1">
                    </path>
                  </svg>
                  MongoDB URI
                </label>
                <input v-model="form.mongoUri" type="text" placeholder="mongodb://localhost:27017"
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-gray-400 bg-gray-50/50 hover:bg-white" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="space-y-2">
                  <label class="block text-sm font-bold text-gray-700 uppercase tracking-wide">Database</label>
                  <input v-model="form.database" type="text" placeholder="test_db"
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-gray-50/50 hover:bg-white" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-bold text-gray-700 uppercase tracking-wide">Collection</label>
                  <input v-model="form.collection" type="text" placeholder="users"
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-gray-50/50 hover:bg-white" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="space-y-2">
                  <label class="block text-sm font-bold text-gray-700 uppercase tracking-wide">Total Records</label>
                  <input v-model.number="form.total" type="number"
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono bg-gray-50/50 hover:bg-white" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-bold text-gray-700 uppercase tracking-wide">Threads</label>
                  <input v-model.number="form.threads" type="number"
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono bg-gray-50/50 hover:bg-white" />
                </div>
              </div>

              <div class="space-y-3">
                <label class="block text-sm font-bold text-gray-700 uppercase tracking-wide">Insert Mode</label>
                <div class="flex items-center gap-6 p-4 bg-gray-50/50 rounded-xl">
                  <label class="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer group">
                    <input type="radio" value="single" v-model="form.mode"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span class="group-hover:text-blue-600 transition-colors">Single</span>
                  </label>
                  <label class="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer group">
                    <input type="radio" value="batch" v-model="form.mode"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span class="group-hover:text-blue-600 transition-colors">Batch</span>
                  </label>

                  <div v-if="form.mode === 'batch'"
                    class="flex items-center gap-3 pl-6 border-l-2 border-blue-300 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span class="text-sm font-bold text-gray-600 uppercase">Size:</span>
                    <input v-model.number="form.batchSize" type="number"
                      class="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm w-24 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none font-mono bg-white"
                      placeholder="100" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Schema Editor -->
          <SchemaEditor v-model="form.schema" />

          <!-- Sample Output -->
          <div
            class="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/60 rounded-3xl shadow-2xl overflow-hidden">
            <div
              class="px-6 py-4 border-b border-gray-700/60 flex justify-between items-center bg-gray-800/80 backdrop-blur-sm">
              <div class="flex items-center gap-3">
                <span class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Sample Output</span>
              </div>
              <button @click="generatePreview"
                class="text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-lg transition-all uppercase flex items-center gap-2">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                  </path>
                </svg>
                Generate Sample
              </button>
            </div>
            <div class="p-6 overflow-auto max-h-80">
              <pre v-if="sampleResult"
                class="text-emerald-400 font-mono text-sm leading-relaxed">{{ sampleResult }}</pre>
              <div v-else class="h-40 flex flex-col items-center justify-center text-gray-500">
                <svg class="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
                <p class="text-sm font-medium italic">Nhấn nút Generate để xem thử 1 bản ghi mẫu...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Options -->
        <div class="xl:col-span-2">
          <SchemaOptions v-model="form.options" @submit="startJob" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobStore } from '@/stores/jobStore'
import { jobApi } from '@/api/jobApi'
import SchemaEditor from '@/components/SchemaEditor.vue'
import SchemaOptions from '@/components/SchemaOption.vue'

const router = useRouter()
const jobStore = useJobStore()

// Trạng thái preview mẫu
const sampleResult = ref(null)
const isStarting = ref(false)

const form = reactive({
  mongoUri: 'mongodb://localhost:27017',
  database: '',
  collection: '',
  schema: '{\n  "type": "object",\n  "properties": {\n   "_id": { "type": "string", "faker": "datatype.uuid" },\n    "name": { "type": "string", "faker": "name.fullName" },\n    "email": { "type": "string", "faker": "internet.email" },\n    "role": { "type": "string", "enum": ["admin", "user", "guest"] }\n  }\n}',
  total: 1000,
  threads: 4,
  mode: 'batch',
  batchSize: 100,
  options: {
    defaultInvalidType: '',
    defaultRandExpMax: 10,
    pruneProperties: '',
    ignoreProperties: '',
    ignoreMissingRefs: false,
    failOnInvalidTypes: true,
    failOnInvalidFormat: true,
    alwaysFakeOptionals: false,
    fixedProbabilities: false,
    optionProbability: 0.5,
    useExamplesValue: false,
    useDefaultValue: false,
    requiredOnly: false,
    omitNulls: false,
    resolveJsonPath: false,
    reuseProperties: false,
    refDepthMax: 5,
    additionalProperties: true,
    uniqueItems: false,
    sortProperties: false,
    replaceEmptyByRandomValue: false,
    minItems: 0,
    maxItems: 10,
    minLength: 0,
    maxLength: 100,
    minDateTime: '1970-01-01',
    maxDateTime: '2025-12-31',
    timeOffset: 0,
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
    renderTitle: true,
    renderDescription: true,
    renderComment: false,
    hideInternalProps: false,
    debug: false,
    seedReset: true,
    strictSchema: true,
    fillProperties: true,
    replaceEmptyByRandom: false,
    random: ''
  }
})

const isValid = computed(() => {
  return (
    form.mongoUri &&
    form.database &&
    form.collection &&
    form.total > 0 &&
    form.schema.length > 2
  )
})

async function generatePreview() {
  try {
    // 1. Parse thử schema từ editor
    const parsedSchema = JSON.parse(form.schema);

    // 2. Kiểm tra nếu là object trống thì không cho gen
    if (Object.keys(parsedSchema).length === 0) {
      sampleResult.value = "// Schema đang trống, hãy nhập gì đó...";
      return;
    }

    // 3. Hiển thị thông báo đang xử lý
    sampleResult.value = "// Đang tạo dữ liệu mẫu dựa trên schema của bạn...";

    // 4. Sử dụng jobApi.generateSample để tạo dữ liệu thật
    setTimeout(async () => {
      try {
        const result = await jobApi.generateSample(parsedSchema, form.options);

        if (result.success) {
          sampleResult.value = JSON.stringify(result.data, null, 2);
        } else {
          sampleResult.value = `//  Lỗi khi tạo dữ liệu: ${result.error}`;
        }
      } catch (fakerError) {
        console.error('Generate sample error:', fakerError);
        sampleResult.value = `//  Lỗi khi tạo dữ liệu: ${fakerError.message}`;
      }
    }, 500);

  } catch (err) {
    sampleResult.value = `//  Lỗi: ${err.message}`;
    alert(' JSON Schema không hợp lệ, vui lòng kiểm tra lại dấu ngoặc!');
  }
}

function validateForm() {
  try {
    JSON.parse(form.schema)
    alert(' JSON Schema hợp lệ!')
    return true
  } catch (err) {
    alert(' JSON Schema không hợp lệ: ' + err.message)
    return false
  }
}

async function startJob(optionsFromChild) {
  if (!validateForm()) return

  isStarting.value = true

  try {
    const finalOptions = optionsFromChild || form.options
    const payload = {
      connection: {
        uri: form.mongoUri,
        db: form.database,
        collection: form.collection
      },
      config: {
        total: form.total,
        threads: form.threads,
        mode: form.mode,
        batchSize: form.mode === 'batch' ? form.batchSize : null
      },
      schema: JSON.parse(form.schema),
      generationOptions: finalOptions
    }

    // Gọi API để start job
    const { jobId } = await jobApi.startJob(payload)

    // Cập nhật store
    jobStore.startJob({
      jobId,
      total: form.total,
      connection: payload.connection,
      config: payload.config
    })

    // Chuyển đến màn hình monitor
    router.push(`/jobs/${jobId}`)

  } catch (error) {
    console.error('Lỗi khi start job:', error)
    alert(' Không thể khởi tạo job: ' + error.message)
  } finally {
    isStarting.value = false
  }
}
</script>