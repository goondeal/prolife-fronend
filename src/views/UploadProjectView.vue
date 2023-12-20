<template>
    <div class="p-4 h-full flex flex-col">
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
        <!-- <div class="relative h-10 w-1/2 bg-gray-100" @click="() => console.log('hi')">
            <div class="absolute right-0 top-0 h-10 w-10 bg-gray-300" @click="() => console.log('hi from child')"></div>
        </div> -->
        <div class="flex flex-col flex-grow">
            <div class="inline-flex rounded-md shadow-sm my-2">
                <button @click="view = 'editor'"
                    :class="view === 'editor' ? 'focus:text-blue-700 dark:text-gray-300 dark:focus:text-white bg-gray-300 dark:bg-gray-900' : 'text-black bg-white dark:bg-gray-700'"
                    class="px-4 py-2 text-sm font-medium  border border-gray-200 rounded-s-lg hover:bg-gray-100 focus:z-10 focus:ring-2  dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:text-white">
                    Editor
                </button>
                <button @click="view = 'tree'"
                    :class="view === 'tree' ? 'focus:text-blue-700 dark:text-gray-300 dark:focus:text-white bg-gray-300 dark:bg-gray-900' : 'text-black bg-white dark:bg-gray-700'"
                    class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600">
                    Tree
                </button>
            </div>
            <div v-if="view === 'editor'" class="flex flex-col flex-grow">
                <JsonEditorVue class="flex-grow" v-model="editor.value" :mode="editor.mode"
                    v-bind="{ navigationBar: false }" />
                <div class="flex justify-center items-end">
                    <button @click="saveProject()"
                        class="mb-2 inline-block md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                        :disabled="isLoading">
                        {{ isLoading ? 'Saving' : 'Save Project' }}
                    </button>
                </div>
            </div>
            <VueTree v-else class="flex-grow" :dataset="getTreeData" :config="editor.treeConfig">
                <template #node="{ node, collapsed }">
                    <div class="p-2 flex items-center justify-start border border-blue-600"
                        :style="{ border: collapsed ? '2px solid grey' : '' }">
                        <span class="flex-grow bg-white text-ellipsis">{{ node.name }}</span>
                    </div>
                </template>
                <template #options="{node}">
                    <div @click="toggleNodeOptionsMenu(node)">
                            <button class="ms-1 p-0 align-middle">
                                <EllipsisVerticalIcon
                                    class="w-6 h-6 p-1 font-bold text-gray-900 hover:bg-gray-200 rounded-full">
                                </EllipsisVerticalIcon>
                            </button>
                            <div id="dropdown" :class="node.showOptionsMenu ? 'block' : 'hidden'"
                                class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200"
                                    aria-labelledby="dropdownDefaultButton">
                                    <li>
                                        <a href="#"
                                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplicate
                                            one</a>
                                    </li>
                                    <li>
                                        <a href="#"
                                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Duplicate
                                            n</a>
                                    </li>
                                    <li>
                                        <a href="#"
                                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                    </li>
                                    <li>
                                        <a href="#"
                                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                </template>
            </VueTree>
        </div>
    </div>
</template>


<script setup>
import { computed, ref } from 'vue'
import JsonEditorVue from 'json-editor-vue'
import useAuthRequest from '../composables/useAuthRequest'
import { useRoute, useRouter } from 'vue-router'
// import VueTree from "@ssthouse/vue3-tree-chart"
import VueTree from "@ssthouse/vue3-tree-chart/src/vue-tree/index"
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { sendAuthRequest } = useAuthRequest()

const editor = ref({
    value: {
        name: "Hello, World",
        tasks: [
            { name: 'hello', showOptionsMenu: false, },
            { name: 'world', showOptionsMenu: false, },
        ],
    },
    mode: 'text',
    treeConfig: { nodeWidth: 150, nodeHeight: 80, levelHeight: 200 }
})

const view = ref('editor')

// const showOptionsMenu = ref(true)
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
                router.replace({ name: 'category-detail', params: { id: route.params.id } })
            }
        })
        .catch((err) => {
            console.log(err)
        }).finally(
            () => isLoading.value = false
        )
}

// Tree view
const deepCopy = (node) => {
    let obj = {};
    for (var key in node) {
        if (node[key] === null) {
            obj[key] = null;
        } else if (Array.isArray(node[key])) {
            obj[key] = node[key].map((x) => deepCopy(x));
        } else if (typeof node[key] === "object") {
            obj[key] = deepCopy(node[key]);
        } else {
            obj[key] = node[key];
        }
    }
    return obj;
}

const changeTasksKeyToChildren = (node) => {
    const oldKey = 'tasks'
    const newKey = 'children'
    if (oldKey in node) {
        Object.defineProperty(node, newKey, Object.getOwnPropertyDescriptor(node, oldKey));
        delete node[oldKey];
        if (Array.isArray(node[newKey])) {
            node[newKey].forEach((child) => changeTasksKeyToChildren(child))
        }
    }
}

let id = 1
const setInvisibleData = (node, parent) => {
    const key = '__invisibleData'
    node[key] = {showOptionsMenu: false}
    if (!('id' in node)) {
        node['__invisibleData']['id'] = id++
        node['__invisibleData']['pid'] = parent ? parent['__invisibleData']['id'] : null
    }
    const newKey = 'children'
    if (newKey in node) {
        if (Array.isArray(node[newKey])) {
            node[newKey].forEach((child) => setInvisibleData(child, node))
        }
    }
}

const toggleNodeOptionsMenu = (node) => {
    node.__invisibleData.showOptionsMenu = !node.__invisibleData.showOptionsMenu
}

const getTreeData = computed(() => {
    const result = deepCopy(editor.value.value)
    changeTasksKeyToChildren(result)
    setInvisibleData(result)
    return result
})

// const removeInvisibleData = (node) => {
//     const key = '__invisibleData'
//     if (key in node) {
//         delete node[key];
//         if (Array.isArray(node['tasks'])) {
//             node['tasks'].forEach((child) => removeInvisibleData(child))
//         }
//     }
// }
// const getEditorData = computed(() => {
//     const result = deepCopy(editor.value.value)
//     removeInvisibleData(result)
//     return result
// })
</script>
