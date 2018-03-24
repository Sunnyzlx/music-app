<template lang="pug">
  div#app
    MHeader
    Tab
    keep-alive
      router-view
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header'
import Tab from '@/components/tab/tab'

export default {
  name: 'App',
  components: {
    MHeader,
    Tab
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
