<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li class="search-item" v-for="(item, index) in searches" :key="index" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: []
    }
  },
  methods: {
    // 点击搜索历史项
    selectItem(item) {
      this.$emit('select', item)
    },
    // 删除搜索历史项
    deleteOne(item) {
      this.$emit('deleteOne', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.search-list
  .search-item
    display flex
    align-items center
    height 40px
    .text
      flex 1
      color $color-text-l
    .icon
      extend-click()
      .icon-delete
        font-size $font-size-small
        color $color-text-d
</style>
