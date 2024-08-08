import { createApp } from 'vue'
import App from './App.vue'

import Icon from '@zi-shui/components/icon'
import Tree from '@zi-shui/components/tree'
import Button from '@zi-shui/components/button'
import Input from '@zi-shui/components/input'

import '@zi-shui/theme-chalk/src/index.scss'
const plugins = [Icon, Tree, Button, Input]
const app = createApp(App)
plugins.forEach(item => app.use(item))
app.mount('#app')
