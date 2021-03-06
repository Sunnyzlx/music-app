<template lang="pug">
  div.music-list
    div.back(@click="back")
      i.icon-back
    h1.title(v-html="title")
    div.bg-image(:style="bgStyle",ref="bgImage")
      div.play-wrapper
        div.play(v-show="songs.length",ref="playBtn",@click="random")
          i.icon-play
          span.text 随机播放全部
      div.filter(ref="filter")
    div.bg-layer(ref="layer")
    scroll.list(@scroll="scroll",:probe-type="probeType",:listen-scroll="listenScroll",:data="songs",ref="list")
      div.song-list-wrapper
        song-list(:songs="songs", @select="selectItem")
      div.loading-container(v-show="!songs.length")
        loading
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll'
import SongList from '@/base/song-list/song-list'
import Loading from '@/base/loading/loading'
import { mapActions } from 'vuex'

// import { prefixStyle } from '@/common/js/dom'

const RESERVED_HEIGHT = 40
// const transform = prefixStyle('transform')

export default {
  name: 'music-list',
  data () {
    return {
      scrollY: 0
    }
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    bgStyle: function () {
      return `background-image:url(${this.bgImage})`
    }
  },
  created: function () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted: function () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    scroll: function (pos) {
      this.scrollY = pos.y
    },
    back: function () {
      this.$router.back()
    },
    selectItem: function (item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    random: function () {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY: function (newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
      this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${translateY}px, 0)`
      const percent = Math.abs(newY / this.imageHeight)

      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur})`
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style.transform = `scale(${scale})`
      this.$refs.bgImage.style.webkitTransform = `scale(${scale})`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/variable"
@import "~@/common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
