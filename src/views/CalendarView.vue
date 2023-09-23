<template>
    <div class="w-full h-full">
        <div class="flex w-full py-2 px-4 justify-between items-center bg-light-bg-secondary border-x border-collapse border-gray-300">
            <div class="flex">
                <ChevronLeftIcon class="h-8 w-8 p-2 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-highlight"></ChevronLeftIcon>
                <ChevronRightIcon class="h-8 w-8 p-2 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-highlight"></ChevronRightIcon>
                <div class="w-5"></div>

            </div>
            <ul class="flex">
                <li v-for="mode in Object.keys(VIEW_MODES)" :key="mode" 
                class="px-2 py-1 capitalize text-sm rounded-md hover:cursor-pointer hover:bg-light-bg-highlight" 
                :class="selectedViewMode == mode ? 'text-blue-600': ''"
                @click="selectViewMode(mode)">{{ mode }}</li>
            </ul>
        </div>
        <component :is="VIEW_MODES[selectedViewMode]" :day="today" :tasks="tasks || {}"></component>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import useAuthRequest from '../composables/useAuthRequest'
import WeekView from '../components/calendar/WeekView.vue'
import MonthView from '../components/calendar/MonthView.vue'


const today = new Date()


const VIEW_MODES = {
    week: WeekView,
    month: MonthView
}
const selectedViewMode = ref('week')

const selectViewMode = (newViewMode) => {
    if (selectedViewMode.value != newViewMode) {
        selectedViewMode.value = newViewMode
    }
}

const { sendAuthRequest } = useAuthRequest()
const tasks = ref({})
const isLoading = ref(false)


const getDateDateString = (date) => date.toString().slice(0, 15)
const datesAreEqual = (d1, d2) => {
    return getDateDateString(d1) == getDateDateString(d2)
}

const getLocale = () => {
    return navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language
}
const getUserTasks = () => {
    isLoading.value = true
    sendAuthRequest({ url: '/calendar/', method: 'get' })
        .then((response) => {
            console.log('calendar list response = ', response)
            if (response.status === 200) {
                const data = response.data.results
                const result = {}
                data.forEach((task) => {
                    const fromTime = (new Date(task['from_time'].slice(0, -1)))
                    const toTime = new Date(task['to'].slice(0, -1))
                    task['style'] = {
                        top: `${fromTime.getMinutes() * 5 / 3}%`, // 100 / 60
                        height: `${((toTime.getHours()*60 + toTime.getMinutes())-(fromTime.getHours()*60 + fromTime.getMinutes())) * 5 / 3}%`
                    }

                    const locale = getLocale()
                    if (datesAreEqual(fromTime, toTime)) {
                        const options = { hour: 'numeric', minute: 'numeric', hour12: true }
                        task['timeSpan'] = `${fromTime.toLocaleTimeString(locale, options)} - ${toTime.toLocaleTimeString(locale, options)}`
                    } else {
                        const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }
                        task['timeSpan'] = `${fromTime.toLocaleString(locale, options)} - ${toTime.toLocaleString(locale, options)}` 
                    }

                    const dateKey = fromTime.toString().slice(0, 15)
                    const timeKey = fromTime.getHours().toString()
                    if (result[dateKey]) {
                        if (result[dateKey][timeKey]) {
                            result[dateKey][timeKey].push(task)
                        } else {
                            result[dateKey][timeKey] = [task]
                        }
                    } else {
                        result[dateKey] = { }
                        result[dateKey][timeKey] = [task]
                    }
                })
                tasks.value = result
                console.log('tasks.value = ', tasks.value)
            }
        }).catch((err) => console.log('calendar list err = ', err))
        .finally(() => isLoading.value = false)
}

// const getDateString = (date) => {
//     return date.toString().slice(0, 15)
// }

onMounted(() => getUserTasks())
// watch(
//     viewMode,
//     getUserTasks
// )

</script>
