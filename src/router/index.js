import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export const asyncRouterMap = [

]
import Layout from '@/views/layout/Layout'
export const constantRouterMap = [
  //主页
  {
    path: '',
    component: Layout,
    // redirect: 'dashboard',
    // children: [{
    // path: 'dashboard',
    // component: _import('dashboard/index'),
    // name: 'dashboard',
    // meta: { title: '首页', icon: 'icon-danweiguanli', noCache: true } //
    // }]
  },
  //商品管理
  {
    path: '/spgl',
    name: 'spgl',
    component: Layout,
    redirect: '/spgl/ppflgl',
    meta: { noCache: false, title: '商品管理', icon: 'icon-shangpinguanli' },
    children: [
      { path: 'ppflgl', component: _import('spgl/ppflgl'), name: "ppflgl", meta: { title: '品牌分类管理', icon: 'icon-danweiguanli', noCache: false } },
      { path: 'spglchild', component: _import('spgl/spglchild'), name: "spglchild", meta: { title: '商品管理', icon: 'icon-danweiguanli', noCache: false } },
      { path: 'spkccx', component: _import('spgl/spkccx'), name: "spkccx", meta: { title: '商品库存查询', icon: 'icon-danweiguanli', noCache: false } },
      { path: 'spckdj', component: _import('spgl/spckdj'), name: 'spckdj', meta: { noCache: false, title: '商品出库登记', icon: 'icon-danweiguanli' } },
      { path: 'sphkdj', component: _import('spgl/sphkdj'), name: 'sphkdj', meta: { noCache: false, title: '商品回库登记', icon: 'icon-danweiguanli' } },
      { path: 'spbsdj', component: _import('spgl/spbsdj'), name: 'spbsdj', meta: { noCache: false, title: '商品报损登记', icon: 'icon-danweiguanli' } },
    ]
  },
  //商城管理 
  {
    path: '/scgl',
    name: 'scgl',
    component: Layout,
    redirect: '/scgl/ggfb',
    meta: { noCache: false, title: '商城管理', icon: 'icon-shouyedianpujishishangcheng' },
    children: [
      { path: 'ggscgl', component: _import('scgl/ggscgl'), name: 'ggscgl', meta: { noCache: false, title: '广告素材管理', icon: 'example' } },
      { path: 'ggfb', component: _import('scgl/ggfb'), name: 'ggfb', meta: { noCache: false, title: '广告发布', icon: 'example' } },
      { path: 'spsxj', component: _import('scgl/spsxj'), name: 'spsxj', meta: { noCache: false, title: '商品上下架', icon: 'example' } },
      // { path: 'qtsz', component: _import('scgl/qtsz'), name: 'qtsz', meta: { noCache: false, title: '其他设置', icon: 'example' } },
    ]
  },
  //营销活动
  {
    path: '/yxhd',
    name: 'yxhd',
    component: Layout,
    redirect: '/yxhd/dzcx',
    meta: { noCache: false, title: '营销活动', icon: 'icon-weibiaoti1' },
    children: [
      { path: 'dzcx', name: 'dzcx', component: _import('yxhd/dzcx'), meta: { noCache: false, title: '打折促销', icon: 'icon-coupon' } },
    ]
  },
  //交易管理
  {
    path: '/jygl',
    name: 'jygl',
    component: Layout,
    redirect: '/jygl/ddcx',
    meta: { noCache: false, title: '交易管理', icon: 'icon-jiaoyiguanli' },
    children: [
      { path: 'ddcx', component: _import('jygl/ddcx'), name: 'ddcx', meta: { noCache: false, title: '订单查询', icon: 'example' } },
      { path: 'pjgl', component: _import('jygl/pjgl'), name: 'pjgl', meta: { noCache: false, title: '评价管理', icon: 'example' } },
      { path: 'thh', component: _import('jygl/thh'), name: 'thh', meta: { noCache: false, title: '退换货', icon: 'example' } },
      { path: 'tkgl', component: _import('jygl/tkgl'), name: 'tkgl', meta: { noCache: false, title: '退款管理', icon: 'example' } }
    ]
  },
  //权限管理
  {
    path: '/qxgl',
    name: 'qxgl',
    component: Layout,
    redirect: '/qxgl/yhxxgl',
    meta: { noCache: false, title: '权限管理', icon: 'icon-caiwuguanli' },
    children: [
      { path: 'yhxxgl', component: _import('qxgl/yhxxgl'), name: 'yhxxgl', meta: { noCache: false, title: '用户信息管理', icon: 'example' } },
      { path: 'qxsz', component: _import('qxgl/qxsz'), name: 'qxsz', meta: { noCache: false, title: '权限設置', icon: 'example' } },
      { path: 'zygl', component: _import('qxgl/zygl'), name: 'zygl', meta: { noCache: false, title: '资源管理', icon: 'example' } },
    ]
  },
  //统计分析
  // {
  //   path: '/统计分析',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     name: 'tjfx',
  //     component: _import('tjfx/index'),
  //     meta: { noCache: false, title: '统计分析', icon: 'icon-licaitongjibiao' }
  //   }]
  // },
  //系统管理
  // {
  //   path: '/xtgl',
  //   name: 'xtgl',
  //   component: Layout,
  //   redirect: '/xtgl/yhgl',
  //   meta: { noCache: false, title: '系统管理', icon: 'icon-xitongguanli' },
  //   children: [
  //     { path: 'yhgl', name: 'yhgl', component: _import('xtgl/yhgl'), meta: { noCache: false, title: '用户管理', icon: 'icon-xitongguanli' } },
  //     { path: 'jsgl', component: _import('xtgl/jsgl'), name: 'jsgl', meta: { noCache: false, title: '角色管理', icon: 'example' } }
  //   ]
  // },


  //登陆界面
  { path: '/login', component: _import('login/index'), hidden: true, },
  { path: '/dgsf2', component: _import('yxhd/dgsf2'), hidden: true, },


]
export default new Router({
  routes: constantRouterMap
})
