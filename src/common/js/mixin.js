import { mapGetters } from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newPlayList) {
      this.handlePlayList(newPlayList)
    }
  },
  methods: {
    handlePlayList() {
      // 若组件未实现此方法 则会执行mixin中的代码 抛出异常
      throw new Error('component must implement handlePlayList method')
    }
  }
}