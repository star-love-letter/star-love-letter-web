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
// 获取单个帖子内容
export function apiGetTable(TableParam) {
    return httpRequest({
		url: '/api/table/table',
		method: 'GET',
        params: TableParam
	})
}
// 获取帖子总数
export function apiGetTableTotal() {
    return httpRequest({
		url: '/api/table/count',
		method: 'GET',
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
