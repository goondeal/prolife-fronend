<template>
    <div class="p-4">
        <h3 class="text-2xl text-center font-bold mb-4">New Category</h3>
        <form method="post" @submit.prevent="onSubmit">
            <div class="min-w-[400px] py-6 flex flex-col text-center justify-start items-stretch leading-6">
                <div>
                    <input class="hidden" type="file" accept="image/*" ref="file" @change="readFile($event)" />
                    <div class="flex">
                        <div class="relative inline-block mx-auto my-4">
                            <img class="w-24 h-24 rounded-full object-cover" :src="profilePicSrc" alt="profile picture">
                            <div
                                class="absolute top-0 h-full w-full rounded-full bg-black opacity-20 flex items-center justify-center">
                                <camera-icon class="h-8 w-8 p-2 color-white rounded-full text-white hover:bg-gray-200 hover:text-black"
                                    @click="browse()"></camera-icon>
                                <trash-icon class="h-8 w-8 p-2 color-white rounded-full text-white hover:bg-gray-200 hover:text-black"
                                @click="removePic()"></trash-icon>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="flex items-center justify-start mb-5">
                    <label class="me-4" for="name">Name: </label>
                    <input type="text" v-model="category.name" required
                        class="block w-full p-2 text-gray-900 border border-gray-300 rounded-sm bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div class="flex items-center justify-start mb-5">
                    <label class="me-4" for="color">color: </label>
                    <div class="relative inline-flex w-10 h-10 rounded-full items-center overflow-hidden">
                        <input class="w-24 h-24 border-none absolute top-1/2 left-1/2 m-0 p-0 overflow-hidden -translate-x-1/2 -translate-y-1/2" v-model="category.color" type="color" name="color">
                    </div>
                </div>
                <div class="flex items-center justify-start mb-5">
                    <input
                        class="me-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        type="checkbox" name="isFeatured" v-model="category.is_featured">
                    <label class="text-sm font-medium text-gray-900 dark:text-gray-300" for="isFeatured">featured </label>
                </div>
            </div>
            <div class="text-center space-x-4 md:block">
                <ModalCancelButton ref="closeBtn" />
                <input type="submit"
                    class="mb-2 inline-block md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                    :disabled="isLoading" :value="isLoading ? 'Saveing...' : 'Save'">
            </div>
        </form>
    </div>
</template>


<script setup>
import { defineProps, ref } from 'vue'
import ModalCancelButton from '../ModalCancelButton.vue'
// import useAuthRequest from '../../../composables/useAuthRequest'
import { CameraIcon, TrashIcon } from '@heroicons/vue/24/outline'


const props = defineProps({
    data: {type: Object, required: false},
    action: {type: Function, required: true}
})
// const { sendAuthRequest } = useAuthRequest()

const defaultSrc = props.data?.img ||'http://localhost:8000/media/categories/default.jpeg'
const category = ref({...(props.data||{name: '', color: '#cccccc', is_featured: true, img: null})})
// const name = ref('')
// const color = ref('#cccccc')
// const isFeatured = ref(true)
// const profilePic = ref()
const file = ref()
const profilePicSrc = ref(defaultSrc)

const isLoading = ref(false)

// const closeModal = inject('closeModal')
// const addCategoryToList = inject('addCategoryToList')

const browse = () => {
    file.value.click()
}

const removePic = () => {
    category.value.img = null
    profilePicSrc.value = defaultSrc
}

const readFile = ($event) => {
    const target = $event.target
    if (target && target.files) {
        category.value.img = target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(category.value.img)
        reader.onload = (res) => {
            profilePicSrc.value = res.target.result
        }
        reader.onerror = (err) => console.log('reader error =', err)
    }
}
const onSubmit = () => {
    props.action(category.value, isLoading)
    // closeModal()
    // if (name.value && color.value) {
    //     isLoading.value = true

    //     sendAuthRequest({ url: '/categories/', method: 'post', data: { name: name.value, color: color.value } })
    //         .then((response) => {
    //             console.log('response.data =', response.data)
    //             if (response.status === 201) {
    //                 addCategoryToList(response.data)
    //                 closeModal()
    //             }
    //         }).catch((err) => console.log('addCategory error =', err))
    //         .finally(
    //             () => {
    //                 isLoading.value = false
    //             }
    //         )
    // }
}

</script>
