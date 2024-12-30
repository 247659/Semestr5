import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createBootstrap} from 'bootstrap-vue-next'

// Add the necessary CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouse, 
    faSignInAlt,  
    faSignOutAlt,
    faUserPlus,
    faCartShopping } from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(faHouse, faSignInAlt, faSignOutAlt, faUserPlus, faCartShopping)


const app = createApp(App)

app.use(router)
app.use(createBootstrap())
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
