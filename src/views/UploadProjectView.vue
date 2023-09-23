<template>
    <div class="p-4">
        <div class="flex justify-start items-center bg-gray-50 p-4">
            <h4 class="text-xl font-medium">Import From a File:</h4>
            <div class="w-8"></div>
            <input type="file" accept=".json" @change="readFile($event)" required />
            <!-- <button @click="toggleUploadFileModal"
                class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-md hover:shadow-lg hover:bg-gray-100">
                Open File
            </button> -->
        </div>
        <div class="my-4 w-full bg-gray-200 text-center">
            Or
        </div>
        <div>
            <JsonEditorVue v-model="editor.value" :mode="editor.mode" v-bind="{ navigationBar: false }" />
            <div class="flex justify-center items-end">

                <button @click="saveProject()"
                    class="mb-2 inline-block md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                    :disabled="isLoading">
                    {{ isLoading ? 'Saving' : 'Save Project' }}
                </button>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
import JsonEditorVue from 'json-editor-vue'
import useAuthRequest from '../composables/useAuthRequest'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { sendAuthRequest } = useAuthRequest()


const editor = ref({
    value: {
        name: "Hello, World",
    },
    mode: 'text'
})

const isLoading = ref(false)

const readFile = ($event) => {
    const target = $event.target
    if (target && target.files) {
        const file = target.files[0]
        const reader = new FileReader()
        // TODO: handle Parsing error
        reader.onload = (res) => {
            try {
                editor.value.value = JSON.parse(res.target.result)
            } catch (error) {
                console.log('Parsing err = ', error)
                res.target.result.substring(1, res.target.result.length - 1)
            }
        }
        reader.onerror = (err) => console.log('reader error =', err)
        reader.readAsText(file)
    }

}

const saveProject = () => {
    isLoading.value = true
    sendAuthRequest({
        url: `/categories/${route.params.id}/projects/`,
        method: 'post',
        data: editor.value.value,
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    })
        .then((res) => {
            console.log('SUCCESS!!')
            console.log(res)
            if (res.status === 201) {
                editor.value.value = {}
                router.replace({name: 'category-detail', params: {id: route.params.id}})
            }
        })
        .catch((err) => {
            console.log(err)
        }).finally(
            () => isLoading.value = false
        )
}

</script>
