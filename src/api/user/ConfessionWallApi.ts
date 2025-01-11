import request from '@/utils/axiosUtils';

//小卡片分页查询
export function cardQuery(params: any, type?: any) {
    return request.get("/user/confessionLog", { params, userType: type })
}

//表白信息详情查询
export function getDetailById(id: string, type?: string) {
    return request.get(`/user/getDetail/${id}`, { userType: type });
}

//新增表白接口
export function saveConfession(params: any) {
    return request.post("/user/saveConfession", params);
}

//修改表白墙贴状态
export function updateConfessionStatus(params: any, type: string) {
    return request.put("/admin/updateConfessionStatus", params, { userType: type });
}

//修改置顶
export function updateTopService(params: any, type: string) {
    return request.put("/admin/updateTop", params, { userType: type })
}

//智慧问答接口
export function chat(question: string) {
    return request.post('/user/ai/chat', {}, { params: { question } })
}