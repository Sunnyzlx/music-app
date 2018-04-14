<template lang="pug">
  div.progress-circle
    svg(:width="radius", :height="radius", viewBox="0 0 100 100", version="1.1", xmins="http://www.w3.org/2000/svg")
      circle.progress-background(r="50",cx="50",cy="50",fill="transparent")
      circle.progress-bar(r="50",cx="50",cy="50",fill="transparent",:stroke-dasharray="dasharray",:stroke-dashoffset="dashoffset")
    slot
</template>

<script type="text/ecmascript-6">
export default {
  name: 'progress-circle',
  data () {
    return {
      dasharray: Math.PI * 100
    }
  },
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    dashoffset: function () {
      return (1 - this.percent) * this.dasharray
    }
  }

}
</script>

<style lang="stylus">
@import "~@/common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
