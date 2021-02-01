import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login'
import API from '../views/API'
import Register from '../views/Register'

Vue.use(VueRouter)
const routes = [{
    path: '/',
    name: 'Home',
    component: Home
}, {
    path: '/api',
    name: 'API',
    component: API
},
{
    path: '/login',
    name: 'Login',
    component: Login
}, {
    path: '/register',
    name: 'Register',
    component: Register
},
{
    path: '/mock',
    name: 'Mock',
    component: () => import( /* webpackChunkName: "Mock" */ '../views/Mock.vue')
},

{
    path: '/editor',
    name: 'Editor',
    component: () => import( /* webpackChunkName: "Editor" */ '../views/Editor.vue')
},
{
    path: '/project',
    name: 'Project',
    component: () => import( /* webpackChunkName: "project" */ '../views/Project.vue')
}
]

const router = new VueRouter({
    routes
})

export default router