<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="queryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shorcutWrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <!-- 热搜词 -->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="(item, index) in hotKeys" :key="index" @click="hotKeyQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!-- 搜索历史 -->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="hotKeyQuery" @deleteOne="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" :query="query" @blurInput="blurInput" @select="saveSearchHistory(query)"></suggest>
    </div>
    <confirm ref="confirm" title="清空所有搜索历史" confirmText="清空" @confirm="clearSearchHistory"></confirm>
    <!-- 歌手详情页 二级路由 -->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { playListMixin } from 'common/js/mixin'
import SearchBox from 'base/search-box/search-box'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import Suggest from 'components/suggest/suggest'
import { getHotKeys } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapActions, mapGetters } from 'vuex'

export default {
  mixins: [playListMixin],
  data() {
    return {
      hotKeys: [],
      query: ''
    }
  },
  computed: {
    shortcut() {
      return this.hotKeys.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  created() {
    // 页面初始时获取热门搜索词
    this._getHotKeys()
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length ? '60px' : ''
      // 需要同时更改 搜索历史 和 搜索结果
      this.$refs.shorcutWrapper.style.bottom = bottom
      this.$refs.searchResult.style.bottom = bottom
      // 改变了DOM样式 需刷新 Scroll 重新计算
      this.$refs.shortcut.refresh()
      this.$refs.suggest.refresh()
    },
    // 搜索热门词
    hotKeyQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    // search-box 中搜索词改变
    queryChange(newQuery) {
      this.query = newQuery
    },
    blurInput() {
      this.$refs.searchBox.blurQuery()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    // 获取热门搜索词
    _getHotKeys() {
      getHotKeys().then((res) => {
        if (res.code === ERR_OK) {
          // 取10个数据
          this.hotKeys = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    SearchList,
    Confirm,
    Scroll,
    Suggest
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.search
  .search-box-wrapper
    margin 20px
  .shortcut-wrapper
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut
      height 100%
      overflow hidden
      .hot-key
        margin 0 20px 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        .item
          display inline-block
          padding 5px 10px
          margin 0 20px 10px 0
          border-radius 6px
          background $color-highlight-background
          font-size $font-size-medium
          color $color-text-d
      .search-history
        position relative
        margin 0 20px
        .title
          display flex
          align-items center
          height 40px
          font-size $font-size-medium
          color $color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size $font-size-medium
              color $color-text-d
  .search-result
    position fixed
    width 100%
    top 178px
    bottom 0
</style>
