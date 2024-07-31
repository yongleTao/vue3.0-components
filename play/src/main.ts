import { createApp } from 'vue'
import App from './App.vue'

import Icon from '@zi-shui/components/icon'
import Tree from '@zi-shui/components/tree'
import '@zi-shui/theme-chalk/src/index.scss'
const plugins = [Icon, Tree]
const app = createApp(App)
plugins.forEach(item => app.use(item))
app.mount('#app')
