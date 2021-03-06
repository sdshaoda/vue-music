<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <!-- 背景图片 -->
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="play-wrapper" ref="playBtn" v-show="songs.length > 0" @click="random">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 滤镜 -->
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 滚动层 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 歌曲列表 -->
    <scroll class="list" ref="list" :data="songs" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <!-- 缓冲 -->
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import { playListMixin } from 'common/js/mixin'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdropFilter = prefixStyle('backdrop-filter')

export default {
  // 使用 mixin
  mixins: [playListMixin],
  props: {
    // 背景图
    bgImage: {
      type: String,
      default: ''
    },
    // 歌曲
    songs: {
      type: Array,
      default: []
    },
    // 标题/歌手名
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    // 根据 url 设置背景图片
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    // 动态设置歌曲列表的上偏移
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = RESERVED_HEIGHT - this.imageHeight
    // this.$refs.list 为 VueComponents 对象，this.$refs.list.$el 为真实 DOM
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    // 实现 mixin 中的方法
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      // 有mini播放器时 设置底部bottom
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    // action 映射
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    // 监听Y轴上的滚动，并进行相应处理
    scrollY(newScrollY) {
      let translateY = Math.max(this.minTranslateY, newScrollY)
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`

      // 图片缩放，高斯模糊，修复一些 bug
      let scale = 1
      let zIndex = 0
      let blur = 0
      const percent = Math.abs(newScrollY / this.imageHeight)
      if (newScrollY > 0) {
        scale = 1 + percent
        zIndex = 1
      } else {
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style[backdropFilter] = `blur(${blur}px)`
      if (newScrollY < this.minTranslateY) {
        zIndex = 1
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = 'block'
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .back
    position: absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    .play-wrapper
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
  .list
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    // overflow: hidden
    background: $color-background
    .song-list-wrapper
      padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
