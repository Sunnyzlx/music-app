<template lang="pug">
  div#app
    MHeader
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header'

export default {
  name: 'App',
  components: {
    MHeader
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable'

#app
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color $color-theme
</style>
