<template>
    <div
        class="max-w-64 min-w-fit h-full bg-light-bg-secondary dark:bg-dark-bg-secondary text-[#202020] dark:text-dark-text-primary text-base">
        <div class="p-2">
            <div v-if="userStore.getUser"
                class="flex flex-col items-center rounded-sm p-2 w-100 mt-8 hover:cursor-pointer hover:bg-light-bg-highlight dark:hover:bg-dark-bg-highlight">
                <img class="w-16 h-16 mb-2 rounded-full" :src="userStore.getUser.profile_pic || defaultSrc"
                    alt="profile picture" />
                <h2 class="dark:text-white font-light text-base text-ellipsis ">
                    {{ userStore.getUser.email }}
                </h2>
            </div>

            <div class="w-full text-center mt-4">
                <button @click="logout"
                    class="text-light-text-muted dark:text-dark-text-muted hover:underline text-center">Logout</button>
            </div>

            <RouterLink :to="{ name: 'calendar' }"
                class="my-12 block w-full hover:bg-light-bg-highlight dark:hover:bg-dark-bg-highlight rounded-md dark:text-dark-text-primary">
                <div class="flex items-center p-2">
                    <CalendarDaysIcon class="w-8 h-8 text-blue-500"></CalendarDaysIcon>
                    <span class="mx-4">calendar</span>
                </div>
            </RouterLink>
            <!-- <hr class="border-light-text-muted mt-8"/> -->
            <CategoriesList />
            <div class="mx-[8px] h-[1px] my-8 bg-gray-400 dark:bg-gray-700"></div>
            <ProjectsList />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import CategoriesList from './CategoriesList.vue'
import ProjectsList from './ProjectsList.vue'
import { RouterLink, useRouter } from 'vue-router'
import useAuthRequest from '../../composables/useAuthRequest'
import { CalendarDaysIcon } from '@heroicons/vue/24/outline'


const router = useRouter()
const userStore = useUserStore()
const { sendAuthRequest } = useAuthRequest()
const defaultSrc = 'http://localhost:8000/media/users/default.jpeg'

const getUser = () => {
    const user = userStore.getUser.value
    console.log('user value =', user)
    if (!user) {
        sendAuthRequest({ url: '/auth/users/me', method: 'get' })
            .then((response) => {
                console.log('user response = ', response)
                if (response.status === 200) {
                    userStore.setUser(response.data)
                    console.log('userStore.user =', userStore.getUser)
                }
            }).catch((err) => console.log('user fetching error =', err))
    }
}

onMounted(() => getUser())

const logout = () => {
    sendAuthRequest({ url: '/auth/token/logout/', method: 'post' })
        .then((response) => console.log('logout response =', response))
        .catch((err) => console.log('logout err =', err))
        .finally(() => {
            router.push({ name: 'login' })
        })
}

</script>
