<template>
    <div class="max-w-64 min-w-fit h-full bg-gray-50 dark:bg-dark-secondary">
        <div class="p-[8px]">
            <div v-if="userStore.getUser" class="flex items-center w-100 my-8 dark:hover:bg-dark-hover hover:cursor-pointer">
                <div class="w-10 h-10 rounded-full bg-red-200">
                </div>
                <div class="w-[8px]"></div>
                <h2 class="dark:text-white font-light text-base text-ellipsis ">
                    {{ userStore.getUser.email }}
                </h2>
            </div>

            <div class="w-full text-center">
                <button @click="logout"
                    class="text-gray-500 dark:text-gray-300 hover:underline text-center">Logout</button>
            </div>

            <div class="mx-[8px] h-[1px] my-8 bg-gray-400 dark:bg-gray-700"></div>
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
import { useRouter } from 'vue-router'
import useAuthRequest from '../../composables/useAuthRequest'


const router = useRouter()
const userStore = useUserStore()
const {sendAuthRequest} = useAuthRequest()

const getUser = () => {
    const user = userStore.getUser.value
    console.log('user value =', user)
    if (!user) {
        sendAuthRequest({url: '/auth/users/me', method: 'get'})
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
    // axios
    // .post(
    //     '/auth/token/logout/',
    //     {
    //         headers: {
    //             'Authorization': `Token ${userStore.accessToken}`
    //         }
    //     }
    // )
    sendAuthRequest({url: '/auth/token/logout/', method: 'post'})
    .then((response) => console.log('logout response =', response))
    .catch((err) => console.log('logout err =', err))
    .finally(() => {
        router.push({name: 'login'})
    })
}

</script>
