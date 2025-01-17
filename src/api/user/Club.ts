import request from '@/utils/axiosUtils'
import type { NumberLiteralType } from 'typescript';

export interface Club {
    title: string;//标题
    type: number | null;//类型 1纳新 2公告
    daily?: string;//社团工作
    welfare?: string;//社团福利
    claim: string;//社团要求/公告内容
    number?: number;//计划纳新人数
    timeType?: number | null;//时间类型 1长期 2限时
    startTime?: string;//开始时间
    endTime?: string;//结束时间
    status?: number | null;
    image1?: string;
    image2?: string;
    image3?: string;
}

export interface ClubPage {
    pageNumber: number;
    pageSize: number;
    title: string;
    type: number | null;
    status: number | null;
    timeType: number | null;
    createTimeStart: string;
    createTimeEnd: string;
}

export interface ClubList {
    id: string;
    clubId: string;
    clubName: string;
    title: string;
    type: number;
    status: number;
    number: number;
    already: number;
    timeType: number;
    startTime: string;
    endTime: string;
    createTime: string;
    sort: number;
}

export function save(params: Club) {
    return request.post('/user/club/save', params);
}

export function pageQuery(params: ClubPage, userType: string) {
    return request.post('/admin/club/page', params, {
        userType
    })
}

export function updateToStatus(params: any, userType?: string) {
    return request.put("/admin/club/updateStatus", params, { userType })
}

export function updateSort(params: any, userType?: string) {
    return request.put("/admin/club/updateSort", params, { userType })
}