<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  props: {
    // 截流，是否派发某类型的滚动事件
    probeType: {
      type: Number,
      default: 1
    },
    // 是否派发 click 事件
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    // 是否监听滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 上拉刷新，默认不开启
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    // 确保 DOM 已准备好，类似 window.onload / nextTick
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      // 避免初始化时 undefined 报错
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) {
        // _this 为vue的实例
        let _this = this
        this.scroll.on('scroll', (pos) => {
          // this 为 better-scroll 的实例
          _this.$emit('scroll', pos)
        })
      }

      // 需要上拉刷新时
      if (this.pullup) {
        // 滚动结束事件
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            // 快滚动到底部时发出事件，基础组件不参与具体业务逻辑
            this.$emit('scrollToEnd')
          }
        })
      }

      // 开始滚动前时进行一些处理
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    // 以下方法都是调用 better-scroll 封装的方法
    enable() {
      // 若存在 this.scroll ，则执行 this.scroll.enable()
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  // props 和 data 中的数据都可被 watch 监听
  watch: {
    // 监听 props.data 的变化，自动刷新
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
