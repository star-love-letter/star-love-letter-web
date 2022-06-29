// 导入axios实例
import httpRequest from '@/request/index'

// 获取帖子分页评论列表
export function apiGetCommentList(CommentListParam) {
    return httpRequest({
        url: '/api/comment/pageList',
        method: 'GET',
        params: CommentListParam
    })
}
// 发布评论
export function apiAddComment(addCommentParam) {
    return httpRequest({
        url: '/api/comment/add?' + addCommentParam,
        method: 'POST',
    })
}