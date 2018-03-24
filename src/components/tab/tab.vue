<template lang="pug">
  div.tab
      router-link.tab-item(tag="div",to="/recommend")
        span.tab-link 推荐
      router-link.tab-item(tag="div",to="/singer")
        span.tab-link 歌手
      router-link.tab-item(tag="div",to="/rank")
        span.tab-link 排行
      router-link.tab-item(tag="div",to="/search")
        span.tab-link 搜索
</template>

<script type="text/ecmascript-6">
export default {
  name: 'tab'
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable'

.tab
  display flex
  line-height 44px
  height 44px
  font-size $font-size-medium
  .tab-item
    flex 1
    text-align center
    .tab-link
      padding-bottom 5px
      color $color-text-l
    &.router-link-active
      .tab-link
        color $color-theme
        border-bottom 2px solid $color-theme
</style>
