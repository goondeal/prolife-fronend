import { defineStore } from 'pinia'


export const useUserStore = defineStore('user', {
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    user: {},
    accessToken: '',
  }),
  getters: {
    getUser: (state) => state.user,
    getAccessToken: (state) => state.accessToken,
  },
  actions: {
    initStore() {
        const accessToken = localStorage.getItem('accessToken') 
        const user = localStorage.getItem('user')
        if (accessToken) {
            this.setUser(user)
            this.setAccessToken(accessToken)
        } 
    },
    setUser(user) {
        this.user = user
        localStorage.setItem('user', user)
    },
    setAccessToken(token) {
        this.accessToken = token
        localStorage.setItem('accessToken', token)
    },
  },
})