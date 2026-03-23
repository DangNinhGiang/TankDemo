<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                  </path>
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Job Monitor
                </h1>
                <div class="flex items-center gap-3 text-sm text-gray-600">
                  <span class="font-mono bg-gray-100 px-2 py-1 rounded-lg">Job ID: <b class="text-blue-600">{{
                    job.jobId }}</b></span>
                  <StatusBadge :status="job.status" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button v-if="job.status === 'STOPPED'" @click="resumeJob"
              class="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z">
                </path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Resume
            </button>

            <button v-if="job.status === 'RUNNING'" @click="pauseJob"
              class="px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Pause
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <!-- Progress Section -->
      <div class="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-xl overflow-hidden">
        <div class="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6">
              </path>
            </svg>
            Progress Tracking
          </h3>
        </div>
        <div class="p-6">
          <ProgressBar :inserted="job.inserted" :total="job.total" :throughput="job.throughput" :status="job.status" />
        </div>
      </div>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div
          class="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
            </div>
            <span class="text-xs font-bold text-blue-600 uppercase tracking-wide">Inserted</span>
          </div>
          <div class="text-2xl font-bold text-gray-800">{{ job.inserted.toLocaleString() }}</div>
        </div>

        <div
          class="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                </path>
              </svg>
            </div>
            <span class="text-xs font-bold text-blue-600 uppercase tracking-wide">Total</span>
          </div>
          <div class="text-2xl font-bold text-gray-800">{{ job.total.toLocaleString() }}</div>
        </div>

        <div
          class="bg-linear-to-r from-red-50 to-orange-50 border border-red-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span class="text-xs font-bold text-red-600 uppercase tracking-wide">Errors</span>
          </div>
          <div class="text-2xl font-bold text-gray-800">{{ job.errors.length }}</div>
        </div>

        <div
          class="bg-linear-to-r from-amber-50 to-yellow-50 border border-amber-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-amber-100 rounded-lg">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z">
                </path>
              </svg>
            </div>
            <span class="text-xs font-bold text-amber-600 uppercase tracking-wide">Throughput</span>
          </div>
          <div class="text-2xl font-bold text-gray-800">{{ job.throughput }} <span
              class="text-sm font-normal text-gray-600">rec/s</span></div>
        </div>
      </div>

      <!-- Logs Section -->
      <div class="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-xl overflow-hidden">
        <div class="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
            Realtime Logs
          </h3>
        </div>
        <div class="p-6">
          <LogViewer :logs="job.logs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useJobStore } from '@/stores/jobStore'
import { jobApi } from '@/api/jobApi'
import StatusBadge from '@/components/StatusBadge.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import LogViewer from '@/components/LogViewer.vue'

const route = useRoute()
const jobStore = useJobStore()

// Lấy jobId từ route params
const jobId = computed(() => route.params.jobId)

// Sử dụng store thay vì mock data
const job = computed(() => ({
  jobId: jobStore.jobId,
  status: jobStore.status,
  inserted: jobStore.inserted,
  total: jobStore.total,
  throughput: jobStore.throughput,
  errors: jobStore.errors,
  logs: jobStore.logs
}))

let timer = null
let streamUnsubscribe = null

function pauseJob() {
  jobStore.stopJob()
  // Stop real-time updates when paused
  if (timer) clearInterval(timer)
  if (streamUnsubscribe) streamUnsubscribe()
  timer = null
  streamUnsubscribe = null
}

function resumeJob() {
  jobStore.loading()
  // Resume real-time updates when resumed
  startPolling()
  startStream()
}

// Polling để cập nhật job status
function startPolling() {
  timer = setInterval(async () => {
    if (jobId.value) {
      try {
        const status = await jobApi.getJobStatus(jobId.value)
        jobStore.updateProgress(status.inserted - jobStore.inserted)

        if (status.status === 'COMPLETED') {
          jobStore.completeJob()
          clearInterval(timer)
        }
      } catch (error) {
        console.error('Error polling job status:', error)
      }
    }
  }, 1000)
}

// SSE stream cho real-time updates
function startStream() {
  if (jobId.value) {
    streamUnsubscribe = jobApi.streamJob(jobId.value, (data) => {
      jobStore.updateProgress(data.inserted - jobStore.inserted)
      if (data.logs?.length > 0) {
        data.logs.forEach(log => jobStore.addLog(log.level, log.message, log.data))
      }
    })
  }
}

onMounted(() => {
  if (jobId.value) {
    startPolling()
    startStream()
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  if (streamUnsubscribe) streamUnsubscribe()
})
</script>
