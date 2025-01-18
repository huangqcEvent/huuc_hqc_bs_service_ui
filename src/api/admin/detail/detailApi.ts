import request from '@/utils/axiosUtils';

export interface DetailParams {
    postId: string;
    postType: number;
    userId: string;
}
export interface DetailData {
    userInfo: UserInfo;
    auditInfo: AuditInfoData[];
    clubRecruitmentNewsInfo?: ClubRecruitmentNewsInfoData;
    confessionInfo?: ConfessionInfoData;
    lostItemInfo?: LostItemInfoData
}
export interface UserInfo {
    userId: string;
    userName: string;
    userHead: string;
}
export interface ClubRecruitmentNewsInfoData {
    id: string;
    title: string;
    type: number;
    typeName: string;
    daily: string;
    welfare: string;
    claim: string;
    number: number;
    already: number;
    timeType: number;
    timeTypeName: string;
    startTime: Date;
    endTime: Date;
    createTime: Date;
    image1: string;
    image2: string;
    image3: string;
}
export interface ConfessionInfoData {
    id: string;
    createTime: string;
    title: string;
    summary: string;
    content: string;
    type: number;
    typeName: string;
    toUserInfo: string;
    image1: string;
    image2: string;
    image3: string;
}
export interface LostItemInfoData {
    id: string;
    itemName: string;
    type: number;
    typeName: string
    itemDesc: string;
    location: string;
    phone: string;
    createTime: Date;
    image1: string;
    image2: string;
    image3: string;
}
export interface AuditInfoData {
    auditUserName: string;
    auditType: number;
    auditTypeName: string;
    auditTime: string;
    auditResult: number;
    auditResultName: string;
    auditReason: string
}

export function getDetail(params: DetailParams, userType: string) {
    return request.post("/admin/audit/getDetail", params, {
        userType
    })
}