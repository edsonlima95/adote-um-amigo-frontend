import axios from "axios";
import { getCookie, removeCookies } from "cookies-next";
import  Router  from "next/router";

const token = getCookie('pet.token')

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    headers:{
        Authorization: `Bearer ${token}`
    }
})


api.interceptors.response.use(response => {

    return response

}, (error) => {
    if (error.response.status === 401) {

        removeCookies('pet.token')
        removeCookies('pet.user')

        Router.push("/auth")
    }

    return Promise.reject(error)

})
