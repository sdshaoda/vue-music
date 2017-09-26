<template>
  <div id="app">
    <!-- 顶部标识 -->
    <m-header></m-header>
    <!-- 路由tab -->
    <tab></tab>
    <!--组件缓存-->
    <keep-alive>
      <!--路由-->
      <router-view></router-view>
    </keep-alive>
    <!-- 播放器 -->
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
