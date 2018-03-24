<template lang="pug">
  div.m-header
    div.icon
    h1.text Chicken Music
</template>

<script type="text/ecmascript-6">
export default {
  name: 'm-header'
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable';
@import '~@/common/stylus/mixin';

  .m-header
    position relative
    height 44px
    text-align center
    color $color-theme
    font-size 0
    .icon
      display inline-block
      vertical-align top
      margin: 6px 9px 0 0
      width 30px
      height 32px
      bg-image('logo')
      background-size 30px 32px
    .text
      display inline-block
      vertical-align top
      line-height 44px
      font-size $font-size-large
</style>
