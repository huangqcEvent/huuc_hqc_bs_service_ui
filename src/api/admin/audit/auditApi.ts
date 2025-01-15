import request from '@/utils/axiosUtils';

//请求过滤条件
export interface AuditPage {
    pageNumber: number;
    pageSize: number;
    id: string; //流水号
    userName: string; //用户名称
    status: string; //状态
    postType: number | null; //贴大类型
    postSubType: number | null; //贴小类型
    title: string; //标题
    startTime: string; //提交时间开始
    endTime: string; //提交时间结束
}

export interface PageData {
    id: string; // 流水号
    postId: string; // 贴id
    postType: number; // 贴大类型
    postSubType: number; // 贴小类型
    userId: string; // 用户id
    userName: string; // 用户名称
    title: string; // 标题
    status: number; // 状态
    createTime: string; // 提交时间
    auditTime?: string; // 审核时间
    auditUserId?: string; // 审核人
    auditUserName?: string; // 审核人名称
    reason?: string; // 拒绝原因
}

export function auditPage(params: AuditPage, userType: string) {
    return request.post('/admin/audit/page', params, {
        userType: userType
    })
}