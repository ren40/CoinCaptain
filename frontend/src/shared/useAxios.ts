import axios, { type AxiosInstance } from 'axios';
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/app/store'
import { useRouter } from 'vue-router'

const createAxiosInstance = (baseURL: string): AxiosInstance => {
    return axios.create({
        baseURL,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    });
};

export const useAxios = () => {
    let axiosInstance: AxiosInstance | null = null

    if (axiosInstance) {
        return { axiosInstance }
    }

    axiosInstance = createAxiosInstance(import.meta.env.VITE_BACKEND_URL)
    const router = useRouter()

    axiosInstance.interceptors.request.use((config) => {
        const { token } = storeToRefs(useAuthStore())
        if (token.value) {
            config.headers.Authorization = `Bearer ${token.value}`
        }
        return config
    })

    axiosInstance.interceptors.response.use((response) => response, async error => {
        const originalRequest = error.config

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { token } = storeToRefs(useAuthStore())
                await useAuthStore().reFreshToken();

                if (token.value) {
                    localStorage.setItem('token', token.value); 

                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
                    originalRequest.headers['Authorization'] = `Bearer ${token.value}`;
                    return axiosInstance(originalRequest);
                }
            } catch (_error) {
                console.error('Failed to refresh token:', _error);

                localStorage.removeItem('token');
                router.push('/login');
            }
        }

        return Promise.reject(error)
    })

    return {
        axiosInstance
    }
}