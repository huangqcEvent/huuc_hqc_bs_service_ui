import request from '@/utils/axiosUtils'

//发表评论
export function saveComment(params:any){
   return request.post("/user/comments/addComment",params);
}

//查询所有评论
export function getComments(id:string){
    return request.get(`/user/comments/getComments/${id}`)
}