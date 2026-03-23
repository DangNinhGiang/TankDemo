// import axios from 'axios'
import { JSONSchemaFaker } from 'json-schema-faker'
import { faker } from '@faker-js/faker'

const jsf = JSONSchemaFaker

// Initialize json-schema-faker properly
jsf.extend('faker', () => faker)

// Helper function to set options safely
function setJSFOptions(options) {
  try {
    jsf.reset()
    jsf.option({
      useDefaultValue: true,
      requiredOnly: false,
      minItems: 1,
      maxItems: 3,
      minLength: 1,
      maxLength: 20,
      faker: {
        locale: 'en'
      },
      ...options
    })
  } catch (error) {
    console.error('Error setting JSF options:', error)
  }
}

// Set minimal default options
setJSFOptions({})

// const api = axios.create({
//   baseURL: 'http://localhost:3000', // backend sau này
//   timeout: 10000
// })

const mockJobs = new Map()

function createMockJob(payload) {
  const jobId =
    'JOB-' + Math.random().toString(36).slice(2, 8).toUpperCase()

  mockJobs.set(jobId, {
    jobId,
    status: 'RUNNING',
    inserted: 0,
    total: payload.total,
    throughput: 0,
    errors: [],
    logs: [],
    startTime: Date.now()
  })

  return jobId
}

function pushMockLog(job, level, message, data = null) {
  job.logs.push({
    time: new Date().toLocaleTimeString(),
    level,
    message,
    data
  })

  if (job.logs.length > 500) job.logs.shift()
}

/* ===============================
   PUBLIC API
   =============================== */

export const jobApi = {
  /* Generate Sample Data */
  async generateSample(schema, options = {}) {
    try {
      // For debugging, let's use minimal options first
      console.log('Options received:', options)
      
      const safeOptions = {
        useDefaultValue: true,
        requiredOnly: false,
        minItems: options.minItems || 1,
        maxItems: options.maxItems || 3,
        minLength: options.minLength || 1,
        maxLength: options.maxLength || 20,
        faker: {
          locale: options.faker?.locale || 'en'
        }
      };
      
      console.log('Safe options:', safeOptions)
      
      // Set options safely
      setJSFOptions(safeOptions)

      const sampleData = await jsf.resolve(schema);
      return {
        success: true,
        data: sampleData
      };
    } catch (error) {
      console.error('Error in generateSample:', error)
      return {
        success: false,
        error: error.message
      };
    }

    // REAL API:
    // return api.post('/jobs/generate-sample', { schema, options })
  },

  /* Validate JSON Schema */
  async validateSchema(schemaText) {
    try {
      JSON.parse(schemaText)
      return { valid: true }
    } catch (e) {
      return {
        valid: false,
        error: e.message
      }
    }

    // REAL API:
    // return api.post('/jobs/validate-schema', { schema: schemaText })
  },

  /* Start Job */
  async startJob(payload) {
    // MOCK
    const jobId = createMockJob(payload)

    const job = mockJobs.get(jobId)

    // Configure json-schema-faker with all options from payload
    const mergedOptions = {
      defaultRandExpMax: 10,
      optionProbability: 0.5,
      alwaysFakeOptionals: false,
      useExamplesValue: false,
      useDefaultValue: true,
      requiredOnly: false,
      minItems: 1,
      maxItems: 5,
      minLength: 1,
      maxLength: 20,
      defaultInvalidType: '',
      pruneProperties: '',
      ignoreProperties: '',
      ignoreMissingRefs: false,
      failOnInvalidTypes: true,
      failOnInvalidFormat: true,
      fixedProbabilities: false,
      reuseProperties: false,
      resolveJsonPath: false,
      fillProperties: true,
      sortProperties: false,
      replaceEmptyByRandom: false,
      minDateTime: '1970-01-01',
      maxDateTime: '2025-12-31',
      random: '',
      renderTitle: true,
      renderDescription: true,
      renderComment: false,
      refDepthMax: 5,
      additionalProperties: true,
      uniqueItems: false,
      omitNulls: false,
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
      hideInternalProps: false,
      debug: false,
      seedReset: true,
      strictSchema: true,
      ...payload.generationOptions
    };

    // Set options safely
    setJSFOptions(mergedOptions);

    // simulate progress with real data generation
    const timer = setInterval(async () => {
      if (!job || job.status !== 'RUNNING') {
        clearInterval(timer)
        return
      }

      try {
        // Generate batch of data using json-schema-faker
        const batchSize = Math.min(50, job.total - job.inserted)
        const generatedData = []
        
        for (let i = 0; i < batchSize; i++) {
          const data = await jsf.resolve(payload.schema)
          generatedData.push(data)
        }

        const delta = generatedData.length
        job.inserted = Math.min(job.inserted + delta, job.total)

        const elapsed = (Date.now() - job.startTime) / 1000
        job.throughput = Math.floor(job.inserted / elapsed)

        pushMockLog(
          job,
          'info',
          `Generated ${delta} records (${job.inserted}/${job.total})`
        )

        // Simulate occasional errors
        if (Math.random() < 0.02) {
          const err = { code: 11000, message: 'Duplicate key error' }
          job.errors.push(err)
          pushMockLog(job, 'error', err.message, err)
        }

        if (job.inserted >= job.total) {
          job.status = 'COMPLETED'
          pushMockLog(job, 'info', `Job completed! Generated ${job.total} records`)
          clearInterval(timer)
        }
      } catch (error) {
        pushMockLog(job, 'error', 'Data generation failed', error)
        job.status = 'FAILED'
        clearInterval(timer)
      }
    }, 1000)

    return { jobId }

    // REAL API:
    // return api.post('/jobs/start', payload)
  },

  /* Stop Job */
  async stopJob(jobId) {
    const job = mockJobs.get(jobId)
    if (job) {
      job.status = 'STOPPED'
      pushMockLog(job, 'warn', 'Job stopped by user')
    }

    return { success: true }

    // REAL API:
    // return api.post(`/jobs/stop/${jobId}`)
  },

  /* Get Job Status */
  async getJobStatus(jobId) {
    const job = mockJobs.get(jobId)
    if (!job) throw new Error('Job not found')

    return {
      jobId: job.jobId,
      status: job.status,
      inserted: job.inserted,
      total: job.total,
      throughput: job.throughput,
      errors: job.errors
    }

    // REAL API:
    // return api.get(`/jobs/status/${jobId}`)
  },

  /* Get Logs (polling) */
  async getJobLogs(jobId) {
    const job = mockJobs.get(jobId)
    if (!job) throw new Error('Job not found')

    return job.logs

    // REAL API:
    // return api.get(`/jobs/logs/${jobId}`)
  },

  /* SSE Stream (frontend mock) */
  streamJob(jobId, onMessage) {
    const interval = setInterval(() => {
      const job = mockJobs.get(jobId)
      if (!job) return

      onMessage({
        status: job.status,
        inserted: job.inserted,
        total: job.total,
        throughput: job.throughput,
        logs: job.logs.slice(-5),
        errors: job.errors
      })

      if (job.status !== 'RUNNING') {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }
}
