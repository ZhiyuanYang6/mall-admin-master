import request from '@/utils/request'

export function getmaxspbh(date) { //获取商品编号
  return request({
    url: 'mall/spxx/getmaxspbh.do',
    method: 'post'
  })
}
export function searchspflbysplx(date) { //品牌类别查询
  return request({
    url: 'mall/spfl/searchspflbysplx.do',
    method: 'post'
  })
}
