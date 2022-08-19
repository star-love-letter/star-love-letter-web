// 导入axios实例
import httpRequest from '@/request/index'

// 获取帖子分页列表
export function apiGetPageList(PageListParam) {
	return httpRequest({
		url: '/api/table/pageList',
		method: 'GET',
		// data: PageListParam,
		params: PageListParam
	})
}
// 通过id获取帖子内容
export function apiGetTable(id) {
	return httpRequest({
		url: '/api/table/table',
		method: 'GET',
		params: { id: id }
	})
}
// 获取帖子总数
export function apiGetTableTotal() {
	return httpRequest({
		url: '/api/table/count',
		method: 'GET',
	})
}
// 获取搜索帖子的总数
export function apiGetSearchTableTotal(keyword) {
	return httpRequest({
		url: '/api/table/searchCount',
		method: 'GET',
		params: { keyword: keyword }
	})
}
// 获取搜索帖子列表
export function apiGetSearchList(SearchListParam) {
	return httpRequest({
		url: '/api/table/searchList',
		method: 'GET',
		params: SearchListParam
	})
}
// 发布帖子
export function addTable(tableData) {
	return httpRequest({
		url: '/api/table/add?' + tableData,
		method: 'POST',
	})
}
// 点赞
export function apiLike(id) {
	return httpRequest({
		url: '/api/table/support',
		method: 'PUT',
		params: { tableId: id }
	})
}
// 取消点赞
export function apiCancelLike(id) {
	return httpRequest({
		url: '/api/table/support',
		method: 'DELETE',
		params: { tableId: id }
	})
}
// 举报帖子
export function apiReport(tableId, type, content) {
	return httpRequest({
		url: '/api/reportTable/report',
		method: 'Post',
		params: { tableId: tableId, type: type, content: content }
	})
}
