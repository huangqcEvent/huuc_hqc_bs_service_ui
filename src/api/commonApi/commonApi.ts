import request from '@/utils/axiosUtils';
import axios from 'axios';

//登录接口
export function login(params: any) {
    return axios.post('/api/common/login',
        params
    )
}

//注册接口
export function register(data: any) {
    return axios.post('/api/common/register', data)
}

//退出接口
export function logout(type: string) {
    return request.get("/common/logout",
        { userType: type }
    )
}
//文件上传接口