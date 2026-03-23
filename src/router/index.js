import { createRouter, createWebHistory } from 'vue-router'
import JobConfigView from '@/views/jobConfig.vue'
import JobMonitorView from '@/views/jobMonitorView.vue'

const routes = [
  {
    path: '/',
    redirect: '/jobs/new'
  },
  {
    path: '/jobs/new',
    name: 'job-config',
    component: JobConfigView,
    meta: {
      title: 'Create Seeder Job'
    }
  },
  {
    path: '/jobs/:jobId',
    name: 'job-monitor',
    component: JobMonitorView,
    props: true,
    meta: {
      title: 'Job Monitor'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/* Optional: dynamic title */
router.beforeEach((to) => {
  document.title = to.meta.title || 'MongoDB Seeder'
})

export default router
