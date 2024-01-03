<template>
    <div class="p-4 h-full flex flex-col">
        <!-- <div class="flex justify-start items-center bg-gray-50 p-4">
            <h4 class="text-xl font-medium">Import From a File:</h4>
            <div class="w-8"></div>
            <input type="file" accept=".json" @change="readFile($event)" required /> -->
        <!-- <button @click="toggleUploadFileModal"
                class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-md hover:shadow-lg hover:bg-gray-100">
                Open File
            </button> -->
        <!-- </div>
        <div class="my-4 w-full bg-gray-200 text-center">
            Or
        </div> -->
        <div class="flex justify-between items-center mb-4">
            <h2 class="mb-4 text-4xl font-medium text-gray-900 dark:text-white">{{ newProject.name }}</h2>
            <div class="flex justify-start items-center">
                <button @click="cancelProject"
                    class="me-2 px-4 py-2 text-light-text-muted  hover:bg-light-bg-highlight rounded-md">cancel</button>
                <button @click="saveProject" class="flex items-center px-4 py-2 text-white font-medium bg-blue-600 rounded-md" :disabled="isLoading">
                    <span v-if="isLoading">
                        <TheSpinner class="w-3 h-3 text-white"></TheSpinner>
                    </span>
                    {{isLoading ? 'Saving ...' : 'Save project'}}
                </button>
            </div>
        </div>
        <div class="flex flex-col flex-grow">
            <!-- <div class="inline-flex rounded-md shadow-sm my-2">
                <button @click="view = 'editor'"
                    :class="view === 'editor' ? 'focus:text-blue-700 dark:text-gray-300 dark:focus:text-white bg-gray-300 dark:bg-gray-900' : 'text-black bg-white dark:bg-gray-700'"
                    class="px-4 py-2 text-sm font-medium  border border-gray-200 rounded-s-lg hover:bg-gray-100 focus:z-10 focus:ring-2  dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:text-white">
                    <PencilIcon class="w-6 h-6"></PencilIcon>
                </button>
                <button @click="view = 'tree'"
                    :class="view === 'tree' ? 'focus:text-blue-700 dark:text-gray-300 dark:focus:text-white bg-gray-300 dark:bg-gray-900' : 'text-black bg-white dark:bg-gray-700'"
                    class="px-4 w-10 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 1024 1024" viewBox="0 0 1024 1024">
                        <path
                            d="M603.3 344.1c-24.6 0-49.3 0-73.9 0-33.5 0-67 0-100.5 0-2.7 0-5.3 0-8 0-1 0-1.9-.1-2.9-.1 2.9.2-.9-.3-1.9-.5-.4-.1-3.1-1-1.3-.3 1.7.6-1.7-.9-1.7-.9-.6-.4-3.9-2.6-2.8-1.7 1.3 1.1-.3-.3-.5-.5-.5-.6-1.2-1.3-1.8-1.8-.4-.4-1.7-2.2-.1.1-.4-.5-.8-1.1-1.1-1.6-.4-.7-.9-1.5-1.3-2.2-.4-.7-1.1-3.3-.3-.6-.5-1.5-.9-2.9-1.2-4.5-.4-1.7.1.4.1.7 0-.9-.1-1.8-.1-2.7 0-.2 0-.3 0-.5 0-1 0-2 0-3 0-4.7 0-9.4 0-14.1 0-36 0-72 0-108 0-15.2 0-30.3 0-45.5 0-3.5 0-7 0-10.4 0-.3 0-.6 0-.9 0-.6.2-3.8 0-2.3-.2 1.5.7-2.5.8-3.2.5-2.5.2-.9-.1-.1.3-.6.5-1.2.9-1.7.7-1.3 1.5-2.6 2.4-3.8-1.7 2.4 1.8-1.6 2.4-2.2 1.2-1.1-.3.2-.5.3.7-.5 1.4-1 2.2-1.4.7-.4 1.5-.8 2.3-1.2.2-.1 2.2-.9.6-.3-1.4.5 2.5-.6 3.2-.8 2.7-.8.7-.1 0-.1.9-.1 1.8-.1 2.7-.1.6 0 1.1 0 1.7 0 3.8 0 7.6 0 11.5 0 15.6 0 31.2 0 46.7 0 35.7 0 71.3 0 107 0 4.3 0 8.6 0 13 0 .9 0 1.7 0 2.6 0 .6 0 4.1.2 2.3 0-1.3-.1 2.4.7 3.2.8.5.1 2.8 1 .1-.1.8.3 1.6.7 2.3 1.2.7.4 4.5 3.3 2.3 1.3 1.1 1 2.2 2 3.2 3.1 1.1 1.2-.2-.3-.3-.5.5.7 1 1.4 1.4 2.2.6.9 2.1 5 1.3 2.3.5 1.5.9 3 1.2 4.5.5 2.2.1-2.3 0 0 0 .7.1 1.4.1 2.1 0 .2 0 .3 0 .5 0 3 0 6.1 0 9.1 0 34 0 68.1 0 102.1 0 16.8 0 33.7 0 50.5 0 5.1 0 10.3 0 15.4 0 1.3 0 2.6 0 3.9 0 1.3-.4 5.2.1 2.5-.3 1.5-.7 3-1.1 4.5-.5 1.6.2-.3.3-.5-.3.8-.7 1.6-1.2 2.3-.4.8-.9 1.5-1.3 2.2-.1.2-1.4 1.9-.4.6.9-1.1-1.8 1.8-2.3 2.3-1.8 1.9-.6.5.1.1-.7.5-1.4 1-2.2 1.4-.6.4-4.2 2-2.9 1.5 1.2-.5-2.4.6-3.2.8-.7.2-2.8.3 0 .1C605.1 344 604.2 344.1 603.3 344.1c-7.8.2-15.4 6.8-15 15 .4 8 6.6 15.2 15 15 27.2-.6 46.8-22.4 46.8-49 0-11.8 0-23.6 0-35.3 0-38.6 0-77.1 0-115.7 0-9.6.1-19.3 0-28.9-.4-26.3-21.2-47-47.6-47.2-29.5-.2-59 0-88.5 0-30.6 0-61.1-.1-91.7 0-26.4.1-47.9 20.1-48.4 46.8-.1 8.6 0 17.3 0 25.9 0 38.3 0 76.6 0 114.8 0 12.7 0 25.4 0 38.2 0 5.9.3 11.9 2.1 17.5 5.1 16 19.1 29.3 35.9 32 9.7 1.6 19.7.9 29.5.9 17.7 0 35.4 0 53.2 0 34.2 0 68.4 0 102.6 0 2 0 4.1 0 6.1 0 7.8 0 15.4-6.9 15-15C617.9 351 611.7 344.1 603.3 344.1zM603.3 896.1c-24.6 0-49.3 0-73.9 0-33.5 0-67 0-100.5 0-2.7 0-5.3 0-8 0-1 0-1.9-.1-2.9-.1 2.9.2-.9-.3-1.9-.5-.4-.1-3.1-1-1.3-.3 1.7.6-1.7-.9-1.7-.9-.6-.4-3.9-2.6-2.8-1.7 1.3 1.1-.3-.3-.5-.5-.5-.6-1.2-1.3-1.8-1.8-.4-.4-1.7-2.2-.1.1-.4-.5-.8-1.1-1.1-1.6-.4-.7-.9-1.5-1.3-2.2-.4-.7-1.1-3.3-.3-.6-.5-1.5-.9-2.9-1.2-4.5-.4-1.7.1.4.1.7 0-.9-.1-1.8-.1-2.7 0-.2 0-.3 0-.5 0-1 0-2 0-3 0-4.7 0-9.4 0-14.1 0-36 0-72 0-108 0-15.2 0-30.3 0-45.5 0-3.5 0-7 0-10.4 0-.3 0-.6 0-.9 0-.6.2-3.8 0-2.3-.2 1.5.7-2.5.8-3.2.5-2.5.2-.9-.1-.1.3-.6.5-1.2.9-1.7.7-1.3 1.5-2.6 2.4-3.8-1.7 2.4 1.8-1.6 2.4-2.2 1.2-1.1-.3.2-.5.3.7-.5 1.4-1 2.2-1.4.7-.4 1.5-.8 2.3-1.2.2-.1 2.2-.9.6-.3-1.4.5 2.5-.6 3.2-.8 2.7-.8.7-.1 0-.1.9-.1 1.8-.1 2.7-.1.6 0 1.1 0 1.7 0 3.8 0 7.6 0 11.5 0 15.6 0 31.2 0 46.7 0 35.7 0 71.3 0 107 0 4.3 0 8.6 0 13 0 .9 0 1.7 0 2.6 0 .6 0 4.1.2 2.3 0-1.3-.1 2.4.7 3.2.8.5.1 2.8 1 .1-.1.8.3 1.6.7 2.3 1.2.7.4 4.5 3.3 2.3 1.3 1.1 1 2.2 2 3.2 3.1 1.1 1.2-.2-.3-.3-.5.5.7 1 1.4 1.4 2.2.6.9 2.1 5 1.3 2.3.5 1.5.9 3 1.2 4.5.5 2.2.1-2.3 0 0 0 .7.1 1.4.1 2.1 0 .2 0 .3 0 .5 0 3 0 6.1 0 9.1 0 34 0 68.1 0 102.1 0 16.8 0 33.7 0 50.5 0 5.1 0 10.3 0 15.4 0 1.3 0 2.6 0 3.9 0 1.3-.4 5.2.1 2.5-.3 1.5-.7 3-1.1 4.5-.5 1.6.2-.3.3-.5-.3.8-.7 1.6-1.2 2.3-.4.8-.9 1.5-1.3 2.2-.1.2-1.4 1.9-.4.6.9-1.1-1.8 1.8-2.3 2.3-1.8 1.9-.6.5.1.1-.7.5-1.4 1-2.2 1.4-.6.4-4.2 2-2.9 1.5 1.2-.5-2.4.6-3.2.8-.7.2-2.8.3 0 .1C605.1 896 604.2 896.1 603.3 896.1c-7.8.2-15.4 6.8-15 15 .4 8 6.6 15.2 15 15 27.2-.6 46.8-22.4 46.8-49 0-11.8 0-23.6 0-35.3 0-38.6 0-77.1 0-115.7 0-9.6.1-19.3 0-28.9-.4-26.3-21.2-47-47.6-47.2-29.5-.2-59 0-88.5 0-30.6 0-61.1-.1-91.7 0-26.4.1-47.9 20.1-48.4 46.8-.1 8.6 0 17.3 0 25.9 0 38.3 0 76.6 0 114.8 0 12.7 0 25.4 0 38.2 0 5.9.3 11.9 2.1 17.5 5.1 16 19.1 29.3 35.9 32 9.7 1.6 19.7.9 29.5.9 17.7 0 35.4 0 53.2 0 34.2 0 68.4 0 102.6 0 2 0 4.1 0 6.1 0 7.8 0 15.4-6.9 15-15C617.9 903 611.7 896.1 603.3 896.1zM254.4 896.1c-24.6 0-49.3 0-73.9 0-33.5 0-67 0-100.5 0-2.7 0-5.3 0-8 0-1 0-1.9-.1-2.9-.1 2.9.2-.9-.3-1.9-.5-.4-.1-3.1-1-1.3-.3 1.7.6-1.7-.9-1.7-.9-.6-.4-3.9-2.6-2.8-1.7 1.3 1.1-.3-.3-.5-.5-.5-.6-1.2-1.3-1.8-1.8-.4-.4-1.7-2.2-.1.1-.4-.5-.8-1.1-1.1-1.6-.4-.7-.9-1.5-1.3-2.2-.4-.7-1.1-3.3-.3-.6-.5-1.5-.9-2.9-1.2-4.5-.4-1.7.1.4.1.7 0-.9-.1-1.8-.1-2.7 0-.2 0-.3 0-.5 0-1 0-2 0-3 0-4.7 0-9.4 0-14.1 0-36 0-72 0-108 0-15.2 0-30.3 0-45.5 0-3.5 0-7 0-10.4 0-.3 0-.6 0-.9 0-.6.2-3.8 0-2.3-.2 1.5.7-2.5.8-3.2.5-2.5.2-.9-.1-.1.3-.6.5-1.2.9-1.7.7-1.3 1.5-2.6 2.4-3.8-1.7 2.4 1.8-1.6 2.4-2.2 1.2-1.1-.3.2-.5.3.7-.5 1.4-1 2.2-1.4.7-.4 1.5-.8 2.3-1.2.2-.1 2.2-.9.6-.3-1.4.5 2.5-.6 3.2-.8 2.7-.8.7-.1 0-.1.9-.1 1.8-.1 2.7-.1.6 0 1.1 0 1.7 0 3.8 0 7.6 0 11.5 0 15.6 0 31.2 0 46.7 0 35.7 0 71.3 0 107 0 4.3 0 8.6 0 13 0 .9 0 1.7 0 2.6 0 .6 0 4.1.2 2.3 0-1.3-.1 2.4.7 3.2.8.5.1 2.8 1 .1-.1.8.3 1.6.7 2.3 1.2.7.4 4.5 3.3 2.3 1.3 1.1 1 2.2 2 3.2 3.1 1.1 1.2-.2-.3-.3-.5.5.7 1 1.4 1.4 2.2.6.9 2.1 5 1.3 2.3.5 1.5.9 3 1.2 4.5.5 2.2.1-2.3 0 0 0 .7.1 1.4.1 2.1 0 .2 0 .3 0 .5 0 3 0 6.1 0 9.1 0 34 0 68.1 0 102.1 0 16.8 0 33.7 0 50.5 0 5.1 0 10.3 0 15.4 0 1.3 0 2.6 0 3.9 0 1.3-.4 5.2.1 2.5-.3 1.5-.7 3-1.1 4.5-.5 1.6.2-.3.3-.5-.3.8-.7 1.6-1.2 2.3-.4.8-.9 1.5-1.3 2.2-.1.2-1.4 1.9-.4.6.9-1.1-1.8 1.8-2.3 2.3-1.8 1.9-.6.5.1.1-.7.5-1.4 1-2.2 1.4-.6.4-4.2 2-2.9 1.5 1.2-.5-2.4.6-3.2.8-.7.2-2.8.3 0 .1C256.2 896 255.3 896.1 254.4 896.1c-7.8.2-15.4 6.8-15 15 .4 8 6.6 15.2 15 15 27.2-.6 46.8-22.4 46.8-49 0-11.8 0-23.6 0-35.3 0-38.6 0-77.1 0-115.7 0-9.6.1-19.3 0-28.9-.4-26.3-21.2-47-47.6-47.2-29.5-.2-59 0-88.5 0-30.6 0-61.1-.1-91.7 0C47 650 25.5 670 25 696.8c-.1 8.6 0 17.3 0 25.9 0 38.3 0 76.6 0 114.8 0 12.7 0 25.4 0 38.2 0 5.9.3 11.9 2.1 17.5 5.1 16 19.1 29.3 35.9 32 9.7 1.6 19.7.9 29.5.9 17.7 0 35.4 0 53.2 0 34.2 0 68.4 0 102.6 0 2 0 4.1 0 6.1 0 7.8 0 15.4-6.9 15-15C269 903 262.8 896.1 254.4 896.1zM952.2 896.1c-24.6 0-49.3 0-73.9 0-33.5 0-67 0-100.5 0-2.7 0-5.3 0-8 0-1 0-1.9-.1-2.9-.1 2.9.2-.9-.3-1.9-.5-.4-.1-3.1-1-1.3-.3 1.7.6-1.7-.9-1.7-.9-.6-.4-3.9-2.6-2.8-1.7 1.3 1.1-.3-.3-.5-.5-.5-.6-1.2-1.3-1.8-1.8-.4-.4-1.7-2.2-.1.1-.4-.5-.8-1.1-1.1-1.6-.4-.7-.9-1.5-1.3-2.2-.4-.7-1.1-3.3-.3-.6-.5-1.5-.9-2.9-1.2-4.5-.4-1.7.1.4.1.7 0-.9-.1-1.8-.1-2.7 0-.2 0-.3 0-.5 0-1 0-2 0-3 0-4.7 0-9.4 0-14.1 0-36 0-72 0-108 0-15.2 0-30.3 0-45.5 0-3.5 0-7 0-10.4 0-.3 0-.6 0-.9 0-.6.2-3.8 0-2.3-.2 1.5.7-2.5.8-3.2.5-2.5.2-.9-.1-.1.3-.6.5-1.2.9-1.7.7-1.3 1.5-2.6 2.4-3.8-1.7 2.4 1.8-1.6 2.4-2.2 1.2-1.1-.3.2-.5.3.7-.5 1.4-1 2.2-1.4.7-.4 1.5-.8 2.3-1.2.2-.1 2.2-.9.6-.3-1.4.5 2.5-.6 3.2-.8 2.7-.8.7-.1 0-.1.9-.1 1.8-.1 2.7-.1.6 0 1.1 0 1.7 0 3.8 0 7.6 0 11.5 0 15.6 0 31.2 0 46.7 0 35.7 0 71.3 0 107 0 4.3 0 8.6 0 13 0 .9 0 1.7 0 2.6 0 .6 0 4.1.2 2.3 0-1.3-.1 2.4.7 3.2.8.5.1 2.8 1 .1-.1.8.3 1.6.7 2.3 1.2.7.4 4.5 3.3 2.3 1.3 1.1 1 2.2 2 3.2 3.1 1.1 1.2-.2-.3-.3-.5.5.7 1 1.4 1.4 2.2.6.9 2.1 5 1.3 2.3.5 1.5.9 3 1.2 4.5.5 2.2.1-2.3 0 0 0 .7.1 1.4.1 2.1 0 .2 0 .3 0 .5 0 3 0 6.1 0 9.1 0 34 0 68.1 0 102.1 0 16.8 0 33.7 0 50.5 0 5.1 0 10.3 0 15.4 0 1.3 0 2.6 0 3.9 0 1.3-.4 5.2.1 2.5-.3 1.5-.7 3-1.1 4.5-.5 1.6.2-.3.3-.5-.3.8-.7 1.6-1.2 2.3-.4.8-.9 1.5-1.3 2.2-.1.2-1.4 1.9-.4.6.9-1.1-1.8 1.8-2.3 2.3-1.8 1.9-.6.5.1.1-.7.5-1.4 1-2.2 1.4-.6.4-4.2 2-2.9 1.5 1.2-.5-2.4.6-3.2.8-.7.2-2.8.3 0 .1C954 896 953.1 896.1 952.2 896.1c-7.8.2-15.4 6.8-15 15 .4 8 6.6 15.2 15 15 27.2-.6 46.8-22.4 46.8-49 0-11.8 0-23.6 0-35.3 0-38.6 0-77.1 0-115.7 0-9.6.1-19.3 0-28.9-.4-26.3-21.2-47-47.6-47.2-29.5-.2-59 0-88.5 0-30.6 0-61.1-.1-91.7 0-26.4.1-47.9 20.1-48.4 46.8-.1 8.6 0 17.3 0 25.9 0 38.3 0 76.6 0 114.8 0 12.7 0 25.4 0 38.2 0 5.9.3 11.9 2.1 17.5 5.1 16 19.1 29.3 35.9 32 9.7 1.6 19.7.9 29.5.9 17.7 0 35.4 0 53.2 0 34.2 0 68.4 0 102.6 0 2 0 4.1 0 6.1 0 7.8 0 15.4-6.9 15-15C966.9 903 960.6 896.1 952.2 896.1z">
                        </path>
                        <path d="M527,664.9c0-34.4,0-68.8,0-103.3c0-54.9,0-109.8,0-164.7c0-12.6,0-25.3,0-37.9c0-7.8-6.9-15.4-15-15
				c-8.1,0.4-15,6.6-15,15c0,34.4,0,68.8,0,103.3c0,54.9,0,109.8,0,164.7c0,12.6,0,25.3,0,37.9c0,7.8,6.9,15.4,15,15
				C520.1,679.6,527,673.3,527,664.9L527,664.9z"></path>
                        <path d="M178.1,664.9c0-44.5,0-89.1,0-133.6c0-6.4,0-12.8,0-19.2c-5,5-10,10-15,15c6.2,0,12.4,0,18.6,0
				c17,0,33.9,0,50.9,0c25,0,50,0,74.9,0c30.6,0,61.2,0,91.9,0c33.4,0,66.8,0,100.2,0c33.7,0,67.4,0,101.1,0c31.6,0,63.2,0,94.7,0
				c26.6,0,53.1,0,79.7,0c19.2,0,38.4,0,57.6,0c9,0,18.1,0.4,27.1,0c0.4,0,0.8,0,1.2,0c-5-5-10-10-15-15c0,44.5,0,89.1,0,133.6
				c0,6.4,0,12.8,0,19.2c0,7.8,6.9,15.4,15,15c8.1-0.4,15-6.6,15-15c0-44.5,0-89.1,0-133.6c0-6.4,0-12.8,0-19.2c0-8.1-6.9-15-15-15
				c-6.2,0-12.4,0-18.6,0c-17,0-33.9,0-50.9,0c-25,0-50,0-74.9,0c-30.6,0-61.2,0-91.9,0c-33.4,0-66.8,0-100.2,0
				c-33.7,0-67.4,0-101.1,0c-31.6,0-63.2,0-94.7,0c-26.6,0-53.1,0-79.7,0c-19.2,0-38.4,0-57.6,0c-9,0-18.1-0.2-27.1,0
				c-0.4,0-0.8,0-1.2,0c-8.1,0-15,6.9-15,15c0,44.5,0,89.1,0,133.6c0,6.4,0,12.8,0,19.2c0,7.8,6.9,15.4,15,15
				C171.2,679.6,178.1,673.3,178.1,664.9L178.1,664.9z"></path>
                    </svg>
                </button>
            </div> -->
            <!-- <div v-if="view === 'editor'" class="flex flex-col flex-grow">
                <JsonEditorVue class="flex-grow" v-model="editor.value" :mode="editor.mode"
                    v-bind="{ navigationBar: false }" />
                <div class="flex justify-center items-end">
                    <button @click="saveProject()"
                        class="mb-2 inline-block md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                        :disabled="isLoading">
                        {{ isLoading ? 'Saving' : 'Save Project' }}
                    </button>
                </div>
            </div> -->
            <TreeView class="flex-grow" :data="newProject"></TreeView>
            <Toast></Toast>
        </div>
    </div>
</template>


<script setup>
import { ref, provide, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import useAuthRequest from '../composables/useAuthRequest'
import { useUIDStore } from '../stores/counter'
// import JsonEditorVue from 'json-editor-vue'
// import useUID from '../composables/useUID'
import TreeView from '../components/tree/TreeView.vue'
import TheSpinner from '../components/TheSpinner.vue'
// import OrganizationChart from 'primevue/organizationchart';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';


const toast = useToast()
// const show = () => {
//     toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
// };
// const { getUID } = useUID()
const { getUID } = useUIDStore()
const route = useRoute()
const router = useRouter()
const { sendAuthRequest } = useAuthRequest()


const cancelProject = () => {
    router.push({
        name: 'category-detail',
        params: { id: route.params.id }
    })
}

const copyprojectWithoutIgnoredProps = (node) => {
    let obj = {};
    for (var key in node) {
        if (!key.startsWith('_')) {
            if (node[key] === null) {
                obj[key] = null;
            } else if (Array.isArray(node[key])) {
                obj[key] = node[key].map((x) => copyTaskWithDifferentID(x));
            } else if (typeof node[key] === "object") {
                obj[key] = copyTaskWithDifferentID(node[key]);
            } else {
                obj[key] = node[key];
            }
        }
    }
    return obj;
}
const saveProject = () => {
    isLoading.value = true
    const data = copyprojectWithoutIgnoredProps(newProject.value)
    console.log('project =', data)
    sendAuthRequest({
        url: `/categories/${route.params.id}/projects/`,
        method: 'post',
        data: data,
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }).then((response) => {
            console.log('project uploading response = ', response)
            if (response.status === 201) {
                router.push({ name: 'project-detail', params: {id: route.params.id, projectID: response.data.id} })
            }
        })
        .catch((err) => {
            console.log('project uploading error =', err)
            toast.add({ severity: 'error', summary: err.response.status, detail: err.response.statusText, life: 3000 })
        })
        .finally(() => isLoading.value = false)
}



// project tree
const newProject = ref({
    __id: getUID(),
    name: 'Untitled',
    tags: [],
    description: '',
    auto_weight: true,
    weight: 100,
    progress: 0,
    points: 1
})
const isLoading = ref(false)

const getTreeMap = (task, globalMap, parentMapList, index) => {
    globalMap[task.__id.toString()] = parentMapList ? [...parentMapList, index] : []
    if (task.tasks) {
        for (let i = 0; i < task.tasks.length; i++) {
            getTreeMap(task.tasks[i], globalMap, globalMap[task.__id.toString()], i)
        }
    }
}

const treeMap = {}
getTreeMap(newProject.value, treeMap)
const projectTreeMap = ref(treeMap)
watch(newProject, (value) => {
    const map = {}
    getTreeMap(value, map)
    projectTreeMap.value = map
    console.log('projectTreeMap.value =', projectTreeMap.value)
}, { deep: true })

const findTaskInTree = (id, task) => {
    // console.log('task =', task.name)
    // console.log('task.__id =', task.__id, 'id =', id, task.__id === id)
    // if (task.__id === id) {
    //     return task
    // }
    // console.log('task.tasks =', task.tasks)
    // const tasks = task.tasks || []
    // for (let i = 0; i < tasks.length; i++) {
    //     let res = findTaskInTree(id, tasks[i])
    //     if (res) {
    //         return res
    //     }
    // }
    const taskMap = projectTreeMap.value[id.toString()]
    console.log('taskMap =', taskMap)
    if (taskMap !== undefined) {
        let t = task
        for (const index of taskMap) {
            t = t.tasks[index]
        }
        console.log('t =', t)
        return t
    }
}

const findTaskParentInTree = (taskID) => {
    const map = projectTreeMap.value[taskID.toString()]
    console.log('task map =', map)
    if (map) {
        if (map.length < 2) { return newProject.value }
        else {
            const parentMap = map.slice(0, -1) //projectTreeMap.value[map[map.length - 2].toString()]
            console.log('parentMap =', parentMap)
            if (parentMap) {
                let t = newProject.value
                for (const index of parentMap) {
                    t = t.tasks[index]
                }
                console.log('parent.__id =', t.__id)
                return t
            }
        }
    }
}

const updateSubtasksWeights = (tasks) => {
    if (tasks) {
        const len = tasks.length
        const solidTasks = tasks.filter((t) => t.auto_weight === false)
        const solidWeights = solidTasks.reduce((total, t) => total + (t.weight || 0), 0)
        console.log('st=', solidTasks, 'sw =', solidWeights)
        if (solidWeights > 100) {
            console.log('weight error, sum =', solidWeights)
        } else {
            tasks.forEach((t) => {
                if (t.auto_weight) {
                    t.weight = (100 - solidWeights) / (len - solidTasks.length)
                }
            })
        }
    }
}

const addSubtaskToTask = (task, parentID) => {
    // console.log('parentID =', parentID)
    console.log('new task =', task)
    const parent = findTaskInTree(parentID, newProject.value)
    // console.log('parent =', parent)
    if (parent) {
        task.__id = getUID()
        let tasks = [...(parent.tasks || []), task]
        updateSubtasksWeights(tasks)
        parent.tasks = tasks
    }
    // console.log('newProject =', newProject.value)
}

const editTaskData = (data, id) => {
    const task = findTaskInTree(id, newProject.value)
    const weightChanged = data['auto_weight'] !== task['auto_weight'] || data['weight'] !== task['weight']
    const keys = new Set(Object.keys(data))
    for (const key in data) {
        task[key] = data[key]
    }
    // delete removed attributes
    for (const key in task) {
        if (!key.startsWith('_') && !keys.has(key)) {
            delete task[key]
        }
    }
    if (weightChanged) {
        const parent = findTaskParentInTree(task.__id)
        if (parent) {
            updateSubtasksWeights(parent.tasks || [])
        }
    }
}

const copyTaskWithDifferentID = (node) => {
    let obj = {};
    for (var key in node) {
        if (node[key] === null) {
            obj[key] = null;
        } else if (Array.isArray(node[key])) {
            obj[key] = node[key].map((x) => copyTaskWithDifferentID(x));
        } else if (typeof node[key] === "object") {
            obj[key] = copyTaskWithDifferentID(node[key]);
        } else {
            obj[key] = node[key];
        }
    }
    obj.__id = getUID()
    return obj;
}

const duplicateTask = (task, n) => {
    const taskParent = findTaskParentInTree(task.__id)
    console.log('taskParent id =', taskParent.__id)
    if (taskParent) {
        const tasks = Array.from(Array(n).keys()).map((key) => {
            const t = copyTaskWithDifferentID(task)
            t.name = `${t.name} (${key + 1})`
            return t
        })
        const taskIndex = taskParent.tasks.findIndex((t) => t.__id === task.__id)
        taskParent.tasks.splice(taskIndex + 1, 0, ...tasks)
        updateSubtasksWeights(taskParent.tasks)
    }
}
const deleteTask = (id) => {
    console.log('task id =', id)
    const parent = findTaskParentInTree(id)
    console.log('parent id =', parent.__id)
    if (parent) {
        if (parent.tasks) {
            console.log('parent tasks length =', parent.tasks.length)
            const tasks = parent.tasks.filter((t) => t.__id !== id)
            updateSubtasksWeights(tasks)
            parent.tasks = tasks
            console.log('parent tasks length =', parent.tasks.length)
        }
    }
}

const deleteTaskSubtasks = (id) => {
    const task = findTaskInTree(id, newProject.value)
    if (task) {
        task.tasks = []
    }
}

provide('addSubtaskToTask', addSubtaskToTask)
provide('duplicateTask', duplicateTask)
provide('editTaskData', editTaskData)
provide('deleteTask', deleteTask)
provide('deleteTaskSubtasks', deleteTaskSubtasks)

// const view = ref('tree')


// const showOptionsMenu = ref(true)
// const isLoading = ref(false)

// const readFile = ($event) => {
//     const target = $event.target
//     if (target && target.files) {
//         const file = target.files[0]
//         const reader = new FileReader()
//         // TODO: handle Parsing error
//         reader.onload = (res) => {
//             try {
//                 editor.value.value = JSON.parse(res.target.result)
//             } catch (error) {
//                 console.log('Parsing err = ', error)
//                 res.target.result.substring(1, res.target.result.length - 1)
//             }
//         }
//         reader.onerror = (err) => console.log('reader error =', err)
//         reader.readAsText(file)
//     }

// }

// const saveProject = () => {
//     isLoading.value = true
//     sendAuthRequest({
//         url: `/categories/${route.params.id}/projects/`,
//         method: 'post',
//         data: newProject.value,
//         config: {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }
//     })
//         .then((res) => {
//             console.log('SUCCESS!!')
//             console.log(res)
//             if (res.status === 201) {
//                 newProject.value = {}
//                 router.replace({ name: 'category-detail', params: { id: route.params.id } })
//             }
//         })
//         .catch((err) => {
//             console.log(err)
//         }).finally(
//             () => isLoading.value = false
//         )
// }

// Tree view
// const deepCopy = (node) => {
//     let obj = {};
//     for (var key in node) {
//         if (node[key] === null) {
//             obj[key] = null;
//         } else if (Array.isArray(node[key])) {
//             obj[key] = node[key].map((x) => deepCopy(x));
//         } else if (typeof node[key] === "object") {
//             obj[key] = deepCopy(node[key]);
//         } else {
//             obj[key] = node[key];
//         }
//     }
//     return obj;
// }

// const changeTasksKeyToChildren = (node) => {
//     const oldKey = 'tasks'
//     const newKey = 'children'
//     if (oldKey in node) {
//         Object.defineProperty(node, newKey, Object.getOwnPropertyDescriptor(node, oldKey));
//         delete node[oldKey];
//         if (Array.isArray(node[newKey])) {
//             node[newKey].forEach((child) => changeTasksKeyToChildren(child))
//         }
//     }
// }

// let id = 1
// const setInvisibleData = (node, parent) => {
//     const key = '__invisibleData'
//     node[key] = {showOptionsMenu: false}
//     if (!('id' in node)) {
//         node['__invisibleData']['id'] = id++
//         node['__invisibleData']['pid'] = parent ? parent['__invisibleData']['id'] : null
//     }
//     const newKey = 'children'
//     if (newKey in node) {
//         if (Array.isArray(node[newKey])) {
//             node[newKey].forEach((child) => setInvisibleData(child, node))
//         }
//     }
// }

// const toggleNodeOptionsMenu = (node) => {
//     node.__invisibleData.showOptionsMenu = !node.__invisibleData.showOptionsMenu
// }

// const getTreeData = computed(() => {
//     const result = deepCopy(editor.value.value)
//     changeTasksKeyToChildren(result)
//     setInvisibleData(result)
//     return result
// })

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
