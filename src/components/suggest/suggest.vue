<template>
  <scroll class="suggest" :data="result" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" @beforeScroll="blurInput" ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" :key="item.id" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import Singer from 'common/js/singer'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import { mapMutations, mapActions } from 'vuex'

const TYPE_SINGER = 'singer'
const PER_PAGE = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true
    }
  },
  methods: {
    search() {
      this.hasMore = true
      this.page = 1
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, PER_PAGE).then((res) => {
        if (res.code === ERR_OK) {
          // this.result = this._getResult(res.data)
          this._getResult(res.data).then((result) => {
            this.result = result
          })
          this._checkMore(res.data)
        }
      })
    },
    searchMore() {
      // 没有更多了
      if (!this.hasMore) {
        return
      }
      this.page++
      // 本来想复用this.search()函数的，但是第一次搜索的逻辑特殊，只好分开写了
      search(this.query, this.page, this.showSinger, PER_PAGE).then((res) => {
        if (res.code === ERR_OK) {
          // this.result = this.result.concat(this._getResult(res.data))
          this._getResult(res.data).then((result) => {
            this.result = this.result.concat(result)
          })
          this._checkMore(res.data)
        }
      })
    },
    // 搜索结果icon
    getIconClass(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    // 搜索显示名
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    selectItem(item) {
      // 点击歌手
      if (item.type === TYPE_SINGER) {
        // 生成歌手数据格式
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        // 跳转到歌手详情页 二级路由
        this.$router.push(`/search/${singer.id}`)
        // 更改state
        this.setSinger(singer)
      } else {
        // 点击歌曲，插入到播放列表中
        this.insertSong(item)
      }

      // 点击处理 保存搜索历史
      this.$emit('select')
    },
    blurInput() {
      this.$emit('blurInput')
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    // 检查是否有更多的结果供搜索
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * PER_PAGE) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _getResult(data) {
      let ret = []

      // 搜索结果中有歌手时
      if (data.zhida && data.zhida.singerid) {
        // ...扩展运算符把对象一个个键值对分别拆开，{ }对象运算符再把键值对都组合起来
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }

      if (data.song) {
        // ret = ret.concat(this._normalizeSongs(data.song.list))
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
        })
      }
    },
    // 歌曲数据格式化
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query(newQuery) {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.suggest
  height 100%
  overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      align-items center
      padding-bottom 20px
    .icon
      flex 0 0 30px
      width 3px
      [class^="icon-"]
        font-size 14px
        color $color-text-d
    .name
      flex 1
      font-size $font-size-medium
      color $color-text-d
      overflow hidden
      .text
       no-wrap()
  .no-result-wrapper
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
