<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent" :data="sequenceList">
          <transition-group name="list" tag="ul">
            <li class="item" ref="listItem" v-for="(item, index) in sequenceList" :key="item" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" title="清空播放列表？" confirmText="清空" @confirm="clearPlayList"></confirm>
    </div>
  </transition>
</template>

<script>
import { playMode } from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      showFlag: false
    }
  },
  computed: {
    ...mapGetters([
      'sequenceList',
      'playList',
      'currentSong',
      'mode'
    ])
  },
  methods: {
    show() {
      this.showFlag = true
      // 刷新scroll
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToSong(this.currentSong)
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    // 设置当前播放icon
    getCurrentIcon(song) {
      if (song.id === this.currentSong.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem(song, index) {
      // 随机播放时，先获取索引index
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((item) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
      this.scrollToSong(song)
    },
    scrollToSong(song) {
      const index = this.sequenceList.findIndex((item) => {
        return song.id === item.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    deleteOne(song) {
      this.deleteSong(song)
      if (!this.playList.length) {
        this.hide()
      }
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'deleteSong',
      'clearPlayList'
    ])
  },
  components: {
    Scroll,
    Confirm
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.playlist
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  z-index: 200
  background-color: $color-background-d
  &.list-fade-enter-active, &.list-fade-leave-active
    transition: opacity 0.3s
    .list-wrapper
      transition: all 0.3s
  &.list-fade-enter, &.list-fade-leave-to
    opacity: 0
    .list-wrapper
      transform: translate3d(0, 100%, 0)
  &.list-fade-enter
  .list-wrapper
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    background-color: $color-highlight-background
    .list-header
      position: relative
      padding: 20px 30px 10px 20px
      .title
        display: flex
        align-items: center
        .icon
          margin-right: 10px
          font-size: 30px
          color: $color-theme-d
        .text
          flex: 1
          font-size: $font-size-medium
          color: $color-text-l
        .clear
          extend-click()
          .icon-clear
            font-size: $font-size-medium
            color: $color-text-d
    .list-content
      max-height: 240px
      overflow: hidden
      .item
        display: flex
        align-items: center
        height: 40px
        padding: 0 30px 0 20px
        overflow: hidden
        &.list-enter-active, &.list-leave-active
          transition: all 0.1s
        &.list-enter, &.list-leave-to
          height: 0
        .current
          flex: 0 0 20px
          width: 20px
          font-size: $font-size-small
          color: $color-theme-d
        .text
          flex: 1
          no-wrap()
          font-size: $font-size-medium
          color: $color-text-d
        .like
          extend-click()
          margin-right: 15px
          font-size: $font-size-small
          color: $color-theme
          .icon-favorite
            color: $color-sub-theme
        .delete
          extend-click()
          font-size: $font-size-small
          color: $color-theme
    .list-operate
      width: 140px
      margin: 20px auto 30px auto
      .add
        display: flex
        align-items: center
        padding: 8px 16px
        border: 1px solid $color-text-l
        border-radius: 100px
        color: $color-text-l
        .icon-add
          margin-right: 5px
          font-size: $font-size-small-s
        .text
          font-size: $font-size-small
    .list-close
      text-align: center
      line-height: 50px
      background: $color-background
      font-size: $font-size-medium-x
      color: $color-text-l
</style>
