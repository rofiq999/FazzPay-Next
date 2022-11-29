import axios from 'axios';



export const register = (body) => {
    return axios.post("https://fazzpay-rose.vercel.app/auth/register", body)
}

export const login = (body) => {
    return axios.post("https://fazzpay-rose.vercel.app/auth/login", body)
}

export const getUserId = (token,getId) => {
    return axios.get(`https://fazzpay-rose.vercel.app/user/profile/${getId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
}

export const logout = (token) => {
    return axios.post(`https://fazzpay-rose.vercel.app/auth/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
}

export const transactions = (body, token) => {
    return axios.post(`https://fazzpay-rose.vercel.app/transaction/transfer`, body, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
}