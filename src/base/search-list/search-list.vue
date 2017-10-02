<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li class="search-item" v-for="(item, index) in searches" :key="index">
        <span class="text">{{item}}</span>
        <span class="icon">
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
