<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      // 设置拖动状态
      this.touch.status = true
      // 起始触摸点位置
      this.touch.startX = e.touches[0].pageX
      // 进度条原始位置
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.status) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      // 进度条原始位置 + 拖动距离
      const offsetWidth = Math.min(Math.max(this.touch.left + deltaX, 0), this.$refs.progressBar.clientWidth - progressBtnWidth)
      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      this.touch.status = false
      // 完成拖动后 设置歌曲百分比
      this._triggerPercent()
    },
    progressClick(e) {
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      // 发送 percentChange 事件 具体业务逻辑交给父组件处理
      this.$emit('percentChange', percent)
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.status) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>
