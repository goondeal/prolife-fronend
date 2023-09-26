<template>
    <div class="w-full h-full">
        <div
            class="flex w-full py-2 px-4 justify-between items-center bg-light-bg-secondary border-x border-collapse border-gray-300">
            <div class="flex items-center">
                <ChevronLeftIcon @click="shiftDurationLeft"
                    class="h-8 w-8 p-2 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-highlight">
                </ChevronLeftIcon>
                <ChevronRightIcon @click="shiftDurationRight"
                    class="h-8 w-8 p-2 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-highlight">
                </ChevronRightIcon>
                <div class="flex items-center mx-6">
                    <input id="date" class="w-4 h-6 my-auto align-middle bg-transparent focus:outline-none" type="date" v-model="dayString" name="trip-start"
                        min="2018-01-01" max="2030-12-31" />
                    <button @click="clickDateInput">
                        <div class="flex items-center mx-2">
                            <span>{{ getFormattedDay }}</span>
                            <ChevronDownIcon class="h-8 w-8 py-2"></ChevronDownIcon>
                        </div>
                    </button>
                </div>

            </div>
            <ul class="flex">
                <li v-for="mode in Object.keys(VIEW_MODES)" :key="mode"
                    class="px-2 py-1 capitalize text-sm rounded-md hover:cursor-pointer hover:bg-light-bg-highlight"
                    :class="selectedViewMode == mode ? 'text-blue-600' : ''" @click="selectViewMode(mode)">{{ mode }}</li>
            </ul>
        </div>
        <component :is="VIEW_MODES[selectedViewMode]" :day="day" :tasks="tasks || {}"></component>
    </div>
</template>


<script setup>
import { computed, ref, onMounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import useAuthRequest from '../composables/useAuthRequest'
import WeekView from '../components/calendar/WeekView.vue'
import MonthView from '../components/calendar/MonthView.vue'


const months = ["Jan", "Feb", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"]

const today = new Date()

const day = ref(today)

const dayString = computed({
    get() {
        return day.value.toISOString().substring(0, 10)
    },
    set(val) {
        day.value = new Date(val)
        console.log('set day.value =', day.value)
    }
})
const getFormattedDay = computed(() => {
    const year = day.value.getFullYear()
    const month = months[day.value.getMonth()]
    const d = String(day.value.getDate()).padStart(2, '0')
    console.log('getFormattedDay updated: ', `${d} ${month}, ${year}`)
    return `${d} ${month}, ${year}`
})

const clickDateInput = async () => {
    const dateInput = document.getElementById('date')
    console.log('dateInput =', dateInput)
    await dateInput.showPicker()
}

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


const shiftDurationRight = () => {
    if (selectedViewMode.value == 'week') {
        const newDate = new Date(day.value.getTime())
        newDate.setDate(day.value.getDate() + 7)
        day.value = newDate
    } else if (selectedViewMode.value == 'month') {
        const newDate = new Date(day.value)
        console.log('newDate =', newDate)
        newDate.setMonth(day.value.getMonth() + 1)
        console.log('newDate =', newDate)
        day.value = newDate
    }
}

const shiftDurationLeft = () => {
    if (selectedViewMode.value == 'week') {
        const newDate = new Date(day.value.getTime())
        newDate.setDate(day.value.getDate() - 7)
        day.value = newDate
    } else if (selectedViewMode.value == 'month') {
        const newDate = new Date(day.value)
        console.log('newDate =', newDate)
        newDate.setMonth(day.value.getMonth() - 1)
        console.log('newDate =', newDate)
        day.value = newDate
    }
}


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
                        height: `${((toTime.getHours() * 60 + toTime.getMinutes()) - (fromTime.getHours() * 60 + fromTime.getMinutes())) * 5 / 3}%`
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
                        result[dateKey] = {}
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
