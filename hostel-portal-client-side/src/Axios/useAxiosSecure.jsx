import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAuth from '../Hooks/useAuth';

const axiosSecure = axios.create({
    baseURL: `https://hostel-server-two.vercel.app`,
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(
            config => {
                if (user?.accessToken) {
                    config.headers.Authorization = `Bearer ${user.accessToken}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        const responseInterceptor = axiosSecure.interceptors.response.use(
            response => response,
            error => {
                const status = error?.response?.status;

                if (status === 403) {
                    navigate('/forbidden');
                } else if (status === 401) {
                    logOut()
                        .then(() => navigate('/login'))
                        .catch(() => { });
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [user, logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;