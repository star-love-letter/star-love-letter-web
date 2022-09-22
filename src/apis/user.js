// 导入axios实例
import httpRequest from '@/request/index'
// 登录
export function apiLogin(loginData) {
    // console.log(...loginData)
    return httpRequest({
        url: '/api/user/login',
        method: 'POST',
        data: `userStr=${loginData.userStr}&password=${loginData.password}`
    })
}
// 退出
export function apiLogout() {
    return httpRequest({
        url: '/api/user/logout',
        method: 'POST',
    })
}
// 获取用户信息
export function apiUserInfo() {
    return httpRequest({
        url: '/api/user/user',
        method: 'GET',
    })
}
// 获取邮箱验证码
export function apiGetEmailCode(emailCodeParam) {
    return httpRequest({
        url: '/api/user/emailCode',
        method: 'GET',
        params: emailCodeParam
    })
}
// 获取旋转验证码
export function apiGetRotateCode(email) {
    return httpRequest({
        url: '/api/user/rotateCode',
        method: 'GET',
        params: {
            email
        }
    })
}
// 通过邮箱注册
export function apiAddUser(apiAddUserParam) {
    return httpRequest({
        url: '/api/user/addByEmail',
        method: 'POST',
        params: apiAddUserParam
    })
}
// 通过邮箱验证码修改密码
export function apiUpdatePasswordByEmailCode(updatePwdParam){
    return httpRequest({
        url: '/api/user/updatePasswordByEmailCode',
        method: 'PUT',
        params: updatePwdParam
    })
}