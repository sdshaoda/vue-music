<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="(item, index) in hotKeys" :key="index" @click="hotKeyQuery(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import { getHotKeys } from 'api/search'
import { ERR_OK } from 'api/config'

export default {
  data() {
    return {
      hotKeys: []
    }
  },
  created() {
    // 页面初始时获取热门搜索词
    this._getHotKeys()
  },
  methods: {
    // 搜索热门词
    hotKeyQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    // 获取热门搜索词
    _getHotKeys() {
      getHotKeys().then((res) => {
        if (res.code === ERR_OK) {
          // 取10个数据
          this.hotKeys = res.data.hotkey.slice(0, 10)
        }
      })
    }
  },
  components: {
    SearchBox
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
    width 100px
    top 178px
    bottom 0
</style>
