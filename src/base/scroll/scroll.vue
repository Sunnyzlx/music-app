<template lang="pug">
  div(ref="wrapper")
    slot
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  name: 'scroll',
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted: function () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll: function () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) {
        let _this = this
        this.scroll.on('scroll', (pos) => {
          _this.$emit('scroll', pos)
        })
      }
    },
    enable: function () {
      this.scroll && this.scroll.enable()
    },
    disable: function () {
      this.scroll && this.scroll.disable()
    },
    refresh: function () {
      this.scroll && this.scroll.refresh()
    },
    srollTo: function () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement: function () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data: function () {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>
