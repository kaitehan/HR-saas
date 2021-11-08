import request from '@/utils/request'

// 获取企业的部门列表
export function getDepartments() {
  return request({
    method: 'GET',
    url: '/company/department'
  })
}

// 根据ID删除部门
export function delDepartment(id) {
  return request({
    method: 'delete', // 接口满足restful接口规范
    // 同样的地址 不同的方法 执行不同的任务
    // delete删除业务
    // get获取业务
    // post 新增或添加业务
    // put  修改业务
    url: `/company/department/${id}`
  })
}

// 新增部门
export function addDepartment(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
// 根据id获取某个部门的详情
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}

// 根据id修改部门详情
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
