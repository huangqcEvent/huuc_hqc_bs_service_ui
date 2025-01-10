import request from '@/utils/axiosUtils';

// 用户信息分页查询
export function fetchUsers(params: any) {
  return request.get('/admin/user/userPage', {
    params: params,
    userType: 'admin'
  });
}

//用户封禁与解封
export function banOrUnbanUser(params: any) {

  return request.put('/admin/user/downUser',
    params,
    {
      userType: 'admin'
    });
}

//用户身份转变
export function updateUserIdentity(params: any) {
  return request.put('/admin/user/updateIdentity',
    params,
    {
      userType: 'admin'
    });
}

//身份转变记录分页查询
export function fetchIdentityLog(params: any) {
  return request.get('/admin/user/identityPage', {
    params,
    userType: 'admin'
  });
}

//分页查询封禁记录
export function fetchDownLog(params: any) {
  return request.get('/admin/user/downLogPage', {
    params,
    userType: 'admin'
  })
}

//获得违禁词接口
export function getProhibitedWords() {
  return request.get('/admin/getProhibitedWords', {
    userType: 'admin'
  })
}

//删除白名单
export function deleteWhite(id: string) {
  return request.delete(`/admin/deleteWhiteById/${id}`, {
    userType: 'admin'
  })
}

//删除黑名单
export function deleteBlack(id: string) {
  return request.delete(`/admin/deleteBlackById/${id}`, {
    userType: 'admin'
  })
}

//新增敏感词
export function saveWord(params: any) {
  return request.post('/admin/addProhibitedWords', params, {
    userType: 'admin'
  })
}