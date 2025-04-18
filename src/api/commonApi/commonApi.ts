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
// 文件上传接口
export function upload(file: File) {
    // 使用FormData对象来封装文件数据
    const formData = new FormData();
    formData.append('file', file);

    // 发送POST请求到服务器的/api/common/upload接口
    return axios.post("/api/common/upload", formData, {
        // 设置请求头，指定Content-Type为multipart/form-data
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

//点赞，收藏
export function likedOrCollect(params: any){
    return request.post("/user/postInteraction/likedOrCollect",params);
}
