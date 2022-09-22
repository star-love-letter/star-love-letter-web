import httpRequest from '@/request/index'
// 获取页面显示
export function getView(){
    return httpRequest({
        url: '/api/view/getView',
        method: 'GET',
    })
}