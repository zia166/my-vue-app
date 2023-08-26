import Vue from 'vue'
import Router from 'vue-router'
import LoginForm from '@/views/LoginForm.vue'
import CoverageOverview from '@/views/CoverageOverview.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'LoginForm',
      component: LoginForm,
    },
    {
      path: '/coverage',
      name: 'CoverageOverview',
      component: CoverageOverview,
    },
  ],
  mode: 'history',
})

export default router