import { useQuery } from '@tanstack/react-query';
import useAxios from '../Axios/UseAxios';
import useAuth from '../Hooks/useAuth';

const useAdmin = () => {
    const { user } = useAuth();
    const axiosInstance = useAxios();

    const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
        queryKey: ['isAdmin', user?.email],
        queryFn: async () => {
            const res = await axiosInstance.get(`/users/admin/${user.email}`);
            return res.data.admin === true;
        },
        enabled: !!user?.email // only run if email exists
    });

    return [isAdmin, isAdminLoading];
};

export default useAdmin;