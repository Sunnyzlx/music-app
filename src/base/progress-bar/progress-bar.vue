<template lang="pug">
  div.progress-bar(ref="progressBar", @click="progressClick($event)")
    div.bar-inner
      div.progress(ref="progress")
      div.progress-btn-wrapper(ref="progressBtn",
          @touchstart.prevent="progressTouchStart($event)",
          @touchmove.prevent="progressTouchMove($event)",
          @touchend="progressTouchEnd($event)")
        div.progress-btn
</template>

<script type="text/ecmascript-6">
const progressBtnWidth = 16

export default {
  name: 'progress-bar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created: function () {
    this.touch = {}
  },
  methods: {
    progressTouchStart: function (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove: function (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd: function () {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick: function (e) {
      console.log(e)
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    _triggerPercent: function () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    _offset: function (offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + 'px'
      this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    percent: function (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = barWidth * newPercent
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
