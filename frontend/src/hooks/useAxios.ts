import axios, { Axios } from 'axios'
import { api_url } from '../constant/global'

const useAxios  = () : Axios => axios.create({
    baseURL : api_url
})

export default useAxios