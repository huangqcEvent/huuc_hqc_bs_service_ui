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
    pageSize: number;
    pageNumber: number;
    dateRange: [string, string] | ['','']; // 日期范围数组
}

// 新增寻物贴接口
export function saveLostItem(params: LostItem) {
    return request.post("user/saveLostItem", params);
}

// 分页查询寻物贴
export function lostItemPage(params: Params) {
    return request.post("user/lostItem/page", params, { userType: 'user' });
}