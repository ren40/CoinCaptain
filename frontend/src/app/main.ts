import { createApp } from 'vue'
import './styles/style.css'
import App from '../App.vue'
import { default as router } from './routes'
import { createPinia } from 'pinia'

createApp(App)
.use(createPinia())
.use(router)
.mount('#app')
