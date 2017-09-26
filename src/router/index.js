import Vue from 'vue'
import Router from 'vue-router'

import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail'
import Disc from 'components/disc/disc'
import TopList from 'components/top-list/top-list'

// 注册
Vue.use(Router)

export default new Router({
  routes: [
    {
      // 首页重定向到推荐页
      path: '/',
      redirect: '/recommend'
    },
    {
      // 推荐页
      path: '/recommend',
      component: Recommend,
      children: [
        {
          // 推荐歌单详情页
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      // 歌手列表页
      path: '/singer',
      component: Singer,
      // 子路由
      children: [
        {
          // 歌手详情页
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      // 歌单排行页
      path: '/rank',
      component: Rank,
      children: [
        {
          // 排行榜歌单详情页
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      // 搜索页
      path: '/search',
      component: Search,
      children: [
        {
          // 歌手详情页
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
