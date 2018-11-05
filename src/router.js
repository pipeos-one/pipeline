import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Pipe from './views/Pipe.vue'
import Forms from './views/Forms.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    {
      path: '/',
      name: 'pipe',
      // component: Pipe,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Pipe.vue')
    },
    {
      path: '/forms',
      name: 'forms',
      component: Forms,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Forms.vue')
    },
    {
      path: '/forms/:id',
      name: 'form',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './components/Form.vue')
    },
    {
      path: '/abi/:id',
      name: 'abi',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/PipeFunction.vue')
    },
    {
      path: '/introspection/:id',
      name: 'introspection',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/JsIntrospection.vue')
    },
  ]
})
