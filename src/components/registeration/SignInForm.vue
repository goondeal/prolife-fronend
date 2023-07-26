
<template>
    <div class="bg-white border rounded m-auto my-4" style="width: 26rem;">
        <section class="w-100 px-4 py-3">
            <h2 class="mb-4 font-medium text-2xl">Log in</h2>
            <div class="flex flex-col">
                <div class="text-center">
                    <button class="bg-white border rounded p-2 m-2" type="button">
                        <span class="text-sm">
                            <i class="inline p-2" role="img" aria-label="google" aria-hidden="false">
                                <svg class="inline" width="20" height="20" viewBox="0 0 24 24">
                                    <g fill="none">
                                        <path fill="#4285F4"
                                            d="M23.49,12.27 C23.49,11.48 23.42,10.73 23.3,10 L12,10 L12,14.51 L18.47,14.51 C18.18,15.99 17.33,17.24 16.07,18.09 L16.07,21.09 L19.93,21.09 C22.19,19 23.49,15.92 23.49,12.27 Z">
                                        </path>
                                        <path fill="#34A853"
                                            d="M12,24 C15.24,24 17.95,22.92 19.93,21.09 L16.07,18.09 C14.99,18.81 13.62,19.25 12,19.25 C8.87,19.25 6.22,17.14 5.27,14.29 L1.29,14.29 L1.29,17.38 C3.26,21.3 7.31,24 12,24 Z">
                                        </path>
                                        <path fill="#FBBC05"
                                            d="M5.27,14.29 C5.02,13.57 4.89,12.8 4.89,12 C4.89,11.2 5.03,10.43 5.27,9.71 L5.27,6.62 L1.29,6.62 C0.47,8.24 0,10.06 0,12 C0,13.94 0.47,15.76 1.29,17.38 L5.27,14.29 Z">
                                        </path>
                                        <path fill="#EA4335"
                                            d="M12,4.75 C13.77,4.75 15.35,5.36 16.6,6.55 L20.02,3.13 C17.95,1.19 15.24,0 12,0 C7.31,0 3.26,2.7 1.29,6.62 L5.27,9.71 C6.22,6.86 8.87,4.75 12,4.75 Z">
                                        </path>
                                    </g>
                                </svg>
                            </i>
                            Continue with Google
                        </span>
                    </button>
                </div>

                <div class="w-100 text-center my-8 flex items-center relative">
                    <hr class="m-0 w-full text-gray-500" />
                    <p class="bg-white p-2 rounded m-auto absolute" style="left: 45%;">or</p>
                </div>

                <form method="post" @submit.prevent="signin">
                    <input type="email" id="email" v-model="email"
                        class="my-3 border border-gray-300 text-gray-900 text-sm rounded-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="example@gmail.com" required>

                    <input type="password" id="password" v-model="password"
                        class="my-3 border border-gray-300 text-gray-900 text-sm rounded-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="********" required>


                    <!-- Submit button -->
                    <button type="submit"
                        class="w-full my-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign

                        in</button>
                </form>

                <!-- Register buttons -->
                <p class="text-xs text-center mt-5">
                    Don't have an account? <router-link :to="{ name: 'signup' }" class="underline"> sign up </router-link>
                </p>
            </div>
        </section>
    </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useUserStore } from '../../stores/user';
import { useRouter } from 'vue-router';


const router = useRouter()

const email = ref('')
const password = ref('')

const isValidEmail = computed(() => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
})

const isValidForm = computed(() => {
    return email.value && isValidEmail && password.value
})

const signin = () => {

    if (isValidForm.value) {
        const formData = {
            email: email.value,
            password: password.value,
        }
        console.log('login data = ', formData)

        axios
            .post('/auth/token/login/', formData)
            .then((response) => {
                console.log('login response =', response)
                if (response.status === 200) {
                    const data = response.data

                    // Save user and token
                    const userStore = useUserStore()
                    userStore.setAccessToken(data.auth_token)

                    axios
                        .get(
                            '/auth/users/me',
                            {
                                headers: {
                                    'Authorization': `Token ${userStore.accessToken}`
                                }
                            }
                        )
                        .then((response) => {
                            console.log('user response = ', response)
                            if (response.status === 200) {
                                userStore.setUser(response.data)
                                // Navigate to home
                                router.push({ name: 'home' })
                            }
                        }).catch((err) => console.log('user fetching error =', err))
                }

            })
            .catch((err) => console.log('login error =', err))
    }
}
</script>
