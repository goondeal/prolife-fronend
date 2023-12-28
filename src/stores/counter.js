// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUIDStore = defineStore('uid', () => {
  let uid = 1
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }
  const getUID = () => uid++

  return { getUID }
})
