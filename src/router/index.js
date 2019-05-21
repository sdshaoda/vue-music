import Vue from 'vue'
import Router from 'vue-router'

// 注册
Vue.use(Router)

// const Recommend = (resolve) => {
//   import('components/recommend/recommend').then((module) => {
//     resolve(module)
//   })
// }
// const Recommend = () => import(/* webpackChunkName: "recommend" */ 'components/recommend/recommend')

// const Singer = (resolve) => {
//   import('components/singer/singer').then((module) => {
//     resolve(module)
//   })
// }

// const Rank = (resolve) => {
//   import('components/rank/rank').then((module) => {
//     resolve(module)
//   })
// }

// const Search = (resolve) => {
//   import('components/search/search').then((module) => {
//     resolve(module)
//   })
// }

// const SingerDetail = (resolve) => {
//   import('components/singer-detail/singer-detail').then((module) => {
//     resolve(module)
//   })
// }

// const Disc = (resolve) => {
//   import('components/disc/disc').then((module) => {
//     resolve(module)
//   })
// }

// const TopList = (resolve) => {
//   import('components/top-list/top-list').then((module) => {
//     resolve(module)
//   })
// }

// const UserCenter = (resolve) => {
//   import('components/user-center/user-center').then((module) => {
//     resolve(module)
//   })
// }

const Recommend = r => require.ensure([], () => r(require('components/recommend/recommend')), 'recommend')
const Singer = r => require.ensure([], () => r(require('components/singer/singer')), 'singer')
const Rank = r => require.ensure([], () => r(require('components/rank/rank')), 'rank')
const Search = r => require.ensure([], () => r(require('components/search/search')), 'search')
const SingerDetail = r => require.ensure([], () => r(require('components/singer-detail/singer-detail')), 'singer-detail')
const Disc = r => require.ensure([], () => r(require('components/disc/disc')), 'disc')
const TopList = r => require.ensure([], () => r(require('components/top-list/top-list')), 'top-list')
const UserCenter = r => require.ensure([], () => r(require('components/user-center/user-center')), 'user-center')

export default new Router({
  mode: 'history',
  routes: [
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
    },
    {
      // 个人中心
      path: '/user',
      component: UserCenter
    },
    {
      path: '*',
      redirect: '/recommend'
    }
  ]
})
