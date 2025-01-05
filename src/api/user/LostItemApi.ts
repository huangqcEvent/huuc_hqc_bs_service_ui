import request from '@/utils/axiosUtils';
export interface LostItem {
    id?: number;
    userId?: string;
    itemName: string;
    type: number | null;
    itemDesc: string;
    location: string;
    phone: string;
    createTime?: string;
    status?: number;
    isTop?: number;
    image1?: string;
    image2?: string;
    image3?: string;
}

// 过滤格式
export interface Params {
    type: number | null;
    itemName: string;
    createTimeStart: string;
    createTimeEnd: string;
    status?: number | null;
    pageSize: number;
    pageNumber: number;
    dateRange: [string, string] | ['', '']; // 日期范围数组
}

// 新增寻物贴接口
export function saveLostItem(params: LostItem) {
    return request.post("user/saveLostItem", params);
}

// 分页查询寻物贴
export function lostItemPage(params: Params, userType?: string) {
    return request.post("user/lostItem/page", params, { userType });
}

// 修改状态
export function updateStatus(params: any, userType?: string) {
    return request.put("/admin/lostItem/updateStatus", params, { userType })
}

// 获取寻物贴详情
export function getDetailById(id: string, userType?: string) {
    return request.get(`/user/lostItem/detail/${id}`, { userType })
}

// 置顶状态修改接口
export function updateTopService(params:any,type:string){
    return request.put("/admin/lostItem/updateTop",params,{userType:type})
}