import axios from 'axios'
import { useUserStore } from '../stores/user'

export default () => {
    const userStor = useUserStore()
    const sendAuthRequest = (request) => {
        return axios({
            ...request,
            headers: {
                Authorization: `Token ${userStor.accessToken}`
            }
        })
    }

    return {sendAuthRequest}
}