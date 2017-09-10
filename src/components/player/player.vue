<template>
  <div class="player" v-show="playList.length > 0">
    <!-- 全屏播放器 -->
    <!-- enter、after-enter... 是 transition 组件提供的 JavaScript 钩子 -->
    <transition name="normal" @enter='enter' @after-enter='afterEnter' @leave='leave' @after-leave='afterLeave'>
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img :src="currentSong.image" alt="" class="image">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 小播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdClass" :src="currentSong.image" alt="" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i :class="miniIcon" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @canplay="canPlay" @error="error" @timeupdate="timeUpdate"></audio>
  </div>
</template>

<script type="text/ecmascript-8">
import { mapGetters, mapMutations } from 'vuex'
// GitHub: https://github.com/HenrikJoreteg/create-keyframe-animation
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'

const transform = prefixStyle('transform')

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0
    }
  },
  computed: {
    cdClass() {
      return this.playing ? 'play' : 'play pause'
    },
    disableClass() {
      return this.songReady ? '' : 'disable'
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex'
    ])
  },
  methods: {
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    // done 是回调函数，如在此处会调用 afterEnter
    enter(el, done) {
      // 获取初始值
      const { x, y, scale } = this._getPosAndScale()

      // 定义动画
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      // 注册动画
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      // 运行动画
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      // 注销动画
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // 切换播放状态
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    next() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.setPlayingState(true)
      }
      this.songReady = false
    },
    prev() {
      // 歌曲未准备好时切换到下一首会报错
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.setPlayingState(true)
      }
      this.songReady = false
    },
    canPlay() {
      this.songReady = true
    },
    error() {
      // 加载失败时 不影响程序正常运行
      this.songReady = true
    },
    timeUpdate(e) {
      this.currentTime = e.target.currentTime
    },
    format(interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    // 改变播放进度
    percentChange(percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.setPlayingState(true)
      }
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    // 计算 大CD图 到 小CD图 的偏移
    _getPosAndScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  watch: {
    currentSong() {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    // 根据 playing 切换 audio 的播放状态
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position: absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%
        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      img
        border-radius: 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $color-theme-d
      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
