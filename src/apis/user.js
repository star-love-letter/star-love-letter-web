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