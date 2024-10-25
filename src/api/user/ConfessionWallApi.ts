import request from '@/utils/axiosUtils';

//小卡片分页查询
export function cardQuery(params:any){
    return request.get("/user/confessionLog",{params})
}