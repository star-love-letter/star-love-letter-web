// 导入axios实例
import httpRequest from '@/request/index'

export function apiGetCommentList(CommentListParam) {
    return httpRequest({
        url: '/api/comment/pageList',
        method: 'GET',
        params: CommentListParam
    })
}