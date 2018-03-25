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
    },
    enable: function () {
      this.scroll && this.scroll.enable()
    },
    disable: function () {
      this.scroll && this.scroll.disable()
    },
    refresh: function () {
      this.scroll && this.scroll.refresh()
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
