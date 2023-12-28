import axios from 'axios'
import { useUserStore } from '../stores/user'

export default () => {
    const userStor = useUserStore()
    const sendAuthRequest = (request) => {
        const {config, ...requestOtherInfo} = request
        // console.log('request =', request)
        // console.log('config =', config)
        // console.log('requestOtherInfo =', requestOtherInfo)
        const headers = {
            Authorization: `Token ${userStor.accessToken}`,
            ...(config?.headers || {})
        }
        
        return axios({
            ...requestOtherInfo,
            headers
        })
    }

    return {sendAuthRequest}
}
