<template>
    <div class="w-full h-full overflow-scroll">
        <table class="w-full h-full text-sm text-start border border-collapse border-gray-300">
            <thead class="sticky bg-light-bg-secondary top-0">
                <tr>
                    <!-- <th class="w-12"></th> -->
                    <th v-for="day in WEEK_DAYS" :key="day"
                        class="w-auto min-w-[6rem] min-h-[6rem] text-center p-1 border-collapse border-x border-gray-300">
                        <!-- <div class="p-1 text-center"
                            :class="today.toString().slice(0, 3) == day.slice(0, 3) ? 'text-blue-700' : ''">
                        </div> -->
                        <span :class="today.toString().slice(0, 3) == day.slice(0, 3) ? 'text-blue-700' : ''">{{ day }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="h-[4rem]" v-for="i in Math.floor(getTableDates.length/7)" :key="i">
                    <td v-for="j in 7" :key="i * j"
                        class="text-start align-top border-collapse border border-gray-300 hover:cursor-pointer hover:bg-light-bg-highlight dark:hover:bg-dark-bg-highlight">

                        <span class="p-1 inline-block w-7 h-7 text-center align-middle" :class="getDateDateString(getTableDates[(i - 1) * 7 + (j - 1)]) == getDateDateString(today) ? 'rounded-full bg-blue-600 text-white font-medium' : ''">{{ getTableDates[(i - 1) * 7 + (j - 1)].getDate() }}</span>
                        
                        <!-- {{ tasks[getDateDateString(getTableDates[(i - 1) * 7 + (j - 1)])] ? true: false }} -->
                        <div v-if="tasks[getDateDateString(getTableDates[(i - 1) * 7 + (j - 1)])]"
                        class="overflow-y-scroll scrolbar-hide">
                            <div v-for="(value, key) in tasks[getDateDateString(getTableDates[(i - 1) * 7 + (j - 1)])]" :key="key"
                                class="z-10 w-11/12">
                                <div v-for="task in value" :key="task.task.id" class="mb-1 text-white bg-blue-500 rounded-sm">
                                    <span class="px-1"><small>{{ task.timeSpan.split('-')[0] }}</small></span>
                                    <h4 class="inline">
                                        {{ task.task.name }}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script setup>
import { computed, defineProps, ref, onBeforeMount } from 'vue'


const props = defineProps({
    day: { type: Date, required: true },
    tasks: { type: Object, required: true },
})

const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const getNowIndicatorTop = () => {
    const today = new Date()
    return 4 * 16 * ((today.getMinutes() + today.getSeconds() / 60) / 60)
}
const nowIndicatorTop = ref(getNowIndicatorTop())

const today = new Date()

const daysInMonth = (month, year) => {
    // Month in JavaScript is 0-indexed (January is 0, February is 1, etc), 
    // but by using 0 as the day it will give us the last day of the prior
    // month. So passing in 1 as the month number will return the last day
    // of January, not February
    return new Date(year, month, 0).getDate()
}

const getDateDateString = (date) => date.toString().slice(0, 15)

const getTableDates = computed(() => {
    const monthFirstDay = new Date(props.day.getFullYear(), props.day.getMonth())
    const preMonthShift = WEEK_DAYS.findIndex((day) => day.slice(0, 3) == monthFirstDay.toString().slice(0, 3))
    // console.log('monthFirstDay =', monthFirstDay)
    // console.log('preMonthShift =', preMonthShift)

    const monthLastDay = new Date(props.day.getFullYear(), props.day.getMonth(), 0)
    const postMonthShift = 6 - WEEK_DAYS.findIndex((day) => day.slice(0, 3) == monthLastDay.toString().slice(0, 3))

    const tableDaysCount = preMonthShift + daysInMonth(props.day.getFullYear(), props.day.getMonth()+1) + postMonthShift
    
    const startDate = new Date()
    startDate.setDate(monthFirstDay.getDate() - preMonthShift)
    // console.log('startDate =', startDate)


    const result = []
    for (var i = 0; i < tableDaysCount; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        result.push(date)
        // console.log('date =', date)
    }
    // console.log('getTableDates =', result)
    console.log('getTableDates[24] =', getDateDateString(result[24]))
    console.log('Task =', props.tasks[getDateDateString(result[24])])
    return result
})


// const getLocale = () => {
//     return navigator.languages && navigator.languages.length
//     ? navigator.languages[0]
//     : navigator.language
// }


// const tasks = computed(() => {

//     result.forEach((task) => {
//       task['style'] = getTaskPositionStyle(task)
//       const fromTime = new Date(task['from_time'])
//       const toTime = new Date(task['to'])
//       const locale = getLocale()
//       if (datesAreEqual(fromTime, toTime)) {
//           const options = { hour: 'numeric', minute: 'numeric', hour12: true }
//           task['timeSpan'] = `${fromTime.toLocaleTimeString(locale, options)} - ${toTime.toLocaleTimeString(locale, options)}`
//       } else {
//         const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }
//         task['timeSpan'] = `${fromTime.toLocaleString(locale, options)} - ${toTime.toLocaleString(locale, options)}` 
//       }
//     })
//     console.log('result =', result)

//     return result
// })


// const tasks = computed(() => {
//     console.log('props.tasks =', props.tasks)
//     const result = props.tasks.filter((task) => {
//         const week = weekDates.value
//         const weekStartTime = week[0]
//         const weekEndTime = new Date(week[6].getTime())
//         weekEndTime.setDate(week[6].getDate() + 1)

//         const fromTime = new Date(task['from_time'])
//         return fromTime > weekStartTime && fromTime < weekEndTime
//     })

//     result.forEach((task) => {
//       task['style'] = getTaskPositionStyle(task)
//       const fromTime = new Date(task['from_time'])
//       const toTime = new Date(task['to'])
//       const locale = getLocale()
//       if (datesAreEqual(fromTime, toTime)) {
//           const options = { hour: 'numeric', minute: 'numeric', hour12: true }
//           task['timeSpan'] = `${fromTime.toLocaleTimeString(locale, options)} - ${toTime.toLocaleTimeString(locale, options)}`
//       } else {
//         const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }
//         task['timeSpan'] = `${fromTime.toLocaleString(locale, options)} - ${toTime.toLocaleString(locale, options)}` 
//       }
//     })
//     console.log('result =', result)

//     return result
// })


// const getTaskPositionStyle = (task) => {
//     console.log('task =', task)
//     const todayDiv = document.getElementsByClassName("unique")

//     const fromTime = new Date(task['from_time'])
//     const toTime = new Date(task['to'])
//     const initialWidth = 3
//     const initialHeight = 3
//     const tdWidth = (todayDiv[0].getBoundingClientRect().width + 3) / 16 // 10
//     console.log('tdWidth =', tdWidth)
//     console.log('fromTime.getDay() =', fromTime.getDay())
//     const tdHeight = 4

//     const top = initialHeight + (fromTime.getHours() + fromTime.getMinutes() / 60) * tdHeight
//     const left = initialWidth + fromTime.getDay() * tdWidth
//     const width = tdWidth - 1
//     const height = tdHeight * ((toTime.getHours() + toTime.getMinutes() / 60) - (fromTime.getHours() + fromTime.getMinutes() / 60))
//     // TODO: Consider height edge cases

//     const style = {top: `${top}rem`, left: `${left}rem`, width: `${width}rem`, height: `${height}rem`}
//     console.log('task', task.task.id, ' style = ', style)
//     console.log('fromTime =', fromTime )
//     return style
// }


onBeforeMount(() => setInterval(() => {
    nowIndicatorTop.value = getNowIndicatorTop()
}, 30000))

</script>
