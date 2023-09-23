<template>
    <div class="w-full h-full overflow-scroll">
        <table class="w-full h-full text-sm text-start border border-collapse border-gray-300">
            <thead class="sticky bg-light-bg-secondary dark:bg-dark-bg-secondary top-0">
                <tr>
                    <th class="w-12"></th>
                    <th v-for="date in weekDates" :key="date"
                        class="w-auto min-w-[6rem] text-start border-collapse border-x border-gray-300">
                        <div :ref="el => daysRefs[date.toString().slice(0, 3)] = el" class="p-1"
                            :class="datesAreEqual(date, today) ? 'text-blue-700 unique' : ''">
                            <span>{{ date.toString().slice(0, 3) }}</span>
                            <br />
                            <span>{{ date.getDate() }}</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="h-[4rem]" :class="i - 1 == today.getHours() ? 'relative' : ''" v-for="i in 24" :key="i">
                    <td class="text-center border-collapse border border-gray-300"
                        :class="i - 1 == today.getHours() ? 'bg-green-600 text-white' : ''">{{ i - 1 }}</td>

                    <td class="relative border-collapse border border-gray-300 hover:cursor-pointer hover:bg-light-bg-highlight dark:hover:bg-dark-bg-highlight" v-for="date in weekDates" :key="date">
                        <div v-if="tasks[getDateDateString(date)] && tasks[getDateDateString(date)][`${i-1}`]">
                        
                        <div v-for="task in tasks[getDateDateString(date)][`${i-1}`]" :key="task.task.id"
                            class="absolute z-10 bg-blue-500 p-1 w-11/12 left-0"
                            :style="task['style'] || {}">
                            <h4>
                                {{ task.task.name }}
                            </h4>
                            <span><small>{{ task.timeSpan }}</small></span>
                        </div>
                    </div>
                    </td>

                    <div v-if="i - 1 == today.getHours()" class="h-[1px] bg-green-600 w-full absolute left-0"
                        :style="{ top: nowIndicatorTop + 'px' }"></div>
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

const getNowIndicatorTop = () => {
    const today = new Date()
    return 4 * 16 * ((today.getMinutes() + today.getSeconds() / 60) / 60)
}
const nowIndicatorTop = ref(getNowIndicatorTop())
const daysRefs = ref({})

const today = new Date()

const weekDates = computed(() => {
    const result = [...Array(7)]

    // const today = new Date()
    const startDateIndex = props.day.getDay()

    const firstDayOfWeek = new Date(props.day.getTime())
    firstDayOfWeek.setDate(props.day.getDate() - startDateIndex - 1)
    firstDayOfWeek.setHours(0, 0, 0);

    for (var i = 0; i < 7; i++) {
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 1)
        result[i] = new Date(firstDayOfWeek)
    }
    return result
})

const getDateDateString = (date) => date.toString().slice(0, 15)
const datesAreEqual = (d1, d2) => {
    return getDateDateString(d1) == getDateDateString(d2)
}

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
