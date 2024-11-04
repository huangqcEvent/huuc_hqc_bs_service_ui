import request from '@/utils/axiosUtils';

//小卡片分页查询
export function cardQuery(params:any,type?:any){
    return request.get("/user/confessionLog",{params,userType:type})
}

//表白信息详情查询
export function getDetailById(id: string) {
    return request.get(`/user/getDetail/${id}`);
}

//新增表白接口
export function saveConfession(params:any){
    return request.post("/user/saveConfession",params);
}