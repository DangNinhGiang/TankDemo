import { defineStore } from 'pinia'

export const useJobStore = defineStore('job', {
  state: () => ({
    jobId: null,
    status: 'IDLE', // IDLE | RUNNING | COMPLETED | STOPPED | FAILED
    inserted: 0,
    total: 0,
    throughput: 0,
    errors: [],
    logs: [],
    startTime: null
  }),

  getters: {
    progressPercent(state) {
      if (!state.total) return 0
      return Math.floor((state.inserted / state.total) * 100)
    }
  },

  actions: {
    /* reset when create new job */
    resetJob() {
      this.$reset()
      this.status = 'IDLE'
    },

    /* start job */
    startJob({ jobId, total, connection, config }) {
      this.resetJob()
      
      this.jobId = jobId || 'JOB-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      this.total = total
      this.status = 'RUNNING'
      this.startTime = Date.now()
      
      // Store additional info
      this.connection = connection
      this.config = config

      this.addLog('info', `Job ${this.jobId} started`)
    },

    /* update progress */
    updateProgress(delta) {
      if (this.status !== 'RUNNING') return

      this.inserted = Math.min(this.inserted + delta, this.total)

      const elapsed = (Date.now() - this.startTime) / 1000
      this.throughput = elapsed > 0
        ? Math.floor(this.inserted / elapsed)
        : 0

      this.addLog(
        'info',
        `Inserted ${this.inserted}/${this.total}`
      )

      if (this.inserted >= this.total) {
        this.completeJob()
      }
    },

    /* log helpers */
    addLog(level, message, data = null) {
      this.logs.push({
        time: new Date().toLocaleTimeString(),
        level,
        message,
        data
      })

      if (this.logs.length > 500) {
        this.logs.shift()
      }
    },

    addError(error) {
      this.errors.push(error)
      this.addLog('error', error.message || 'Unknown error', error)
    },

    /* stop job */
    stopJob() {
      if (this.status !== 'RUNNING') return
      this.status = 'STOPPED'
      this.addLog('warn', 'Job stopped by user')
    },

    /* resume/continue job */
    loading() {
      if (this.status === 'STOPPED') {
        this.status = 'RUNNING'
        this.addLog('info', 'Job resumed by user')
      }
    },

    /* complete job */
    completeJob() {
      this.status = 'COMPLETED'
      this.addLog('info', 'Job completed successfully')
    },

    /* fail job */
    failJob(error) {
      this.status = 'FAILED'
      this.addError(error)
    }
  }
})
 