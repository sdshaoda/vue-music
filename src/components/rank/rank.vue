<template>
  <div class="rank">
    <div class="toplist">
      <ul>
        <li class="item">
          <div class="icon">
            <img src="" alt="" width="100" height="100">
          </div>
          <ul class="songlist">
            <li class="song">
              <span></span>
              <span></span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'

export default {
  created() {
    this._getTopList()
  },
  methods: {
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.topList)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.rank
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .toplist
    height: 100%
    overflow: hidden
    .item
      display: flex
      margin: 0 20px
      padding-top: 20px
      height: 100px
      &:last-child
        padding-bottom: 20px
      .icon
        flex: 0 0 100px
        width: 100px
        height: 100px
      .songlist
        flex: 1
        display: flex
        flex-direction: column
        justify-content: center
        padding: 0 20px
        height: 100px
        overflow: hidden
        background: $color-highlight-background
        color: $color-text-d
        font-size: $font-size-small
        .song
          no-wrap()
          line-height: 26px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
