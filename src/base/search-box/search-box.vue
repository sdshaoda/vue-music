<template>
  <!-- 搜索框 -->
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" type="text" class="box" :placeholder="placeholder" v-model="query">
    <i class="icon-dismiss" v-show="query" @click="clearQuery"></i>
  </div>
</template>

<script>
import { debounce } from 'common/js/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      // 使用了v-model 双向数据绑定，数据与视图可以自动同步
      query: ''
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  },
  methods: {
    // 清楚搜索词
    clearQuery() {
      this.query = ''
    },
    // 设置搜索词
    setQuery(query) {
      this.query = query
    },
    blurQuery() {
      this.$refs.query.blur()
      console.log('blur')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.search-box
  display: flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $color-highlight-background
  border-radius: 6px
  .icon-search
    font-size: 24px
    color: $color-background
  .box
    flex: 1
    margin: 0 5px
    line-height: 18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium
    outline: 0
    &::placeholder
      color: $color-text-d
  .icon-dismiss
    font-size: 16px
    color: $color-background
</style>
