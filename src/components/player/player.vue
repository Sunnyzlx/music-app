<template lang="pug">
  div.player(v-show="playList.length>0")
    transition(name="normal",
              @enter="enter",
              @after-enter="afterEnter",
              @leave="leave",
              @after-leave="afterLeave")
      div.normal-player(v-show="fullScreen")
        div.background
          img(width="100%",height="100%",:src="currentSong.image")
        div.top
          div.back(@click="back")
            i.icon-back
          h1.title(v-html="currentSong.name")
          h2.subtitle(v-html="currentSong.singer")
        div.middle
          div.middle-l
            div.cd-wrapper(ref="cdWrapper")
              div.cd(:class="cdCls")
                img.image(:src="currentSong.image")
            div.playing-lyric-wrapper
              div.playing-lyric
        div.bottom
          div.dot-wrapper
            span.dot
            span.dot
          div.progress-wrapper
            span.time.time-l {{format(currentTime)}}
            div.progress-bar-wrapper
              ProgressBar(:percent="percent",@percentChange="onProgressBarChange")
            span.time.time-r {{format(currentSong.duration)}}
          div.operators
            div.icon.i-left(@click="changeMode")
              i(:class="iconMode")
            div.icon.i-left(:class="disabledCls")
              i.icon-prev(@click="prev")
            div.icon.i-center(:class="disabledCls")
              i(@click="togglePlaying",:class="playIcon")
            div.icon.i-right(:class="disabledCls")
              i.icon-next(@click="next")
            div.icon.i-right
              i.icon.icon-not-favorite
    transition(name="mini")
      div.mini-player(v-show="!fullScreen",@click="_setFullScreen")
        div.icon
          img(:class="cdCls",width="40",height="40",:src="currentSong.image")
        div.text
          h2.name(v-html="currentSong.name")
          p.desc(v-html="currentSong.singer")
        div.control
          progress-circle(:radius="32",:percent="percent")
            i.icon-mini(@click.stop="togglePlaying",:class="miniIcon")
        div.control
          i.icon-playlist
    audio(ref="audio",:src="currentSong.url",@canplay="ready",@error="error",@timeupdate="updataTime($event)")
</template>

<script type="text/ecmascript-6">
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util'
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from '@/base/progress-bar/progress-bar'
import ProgressCircle from '@/base/progress-circle/progress-circle'

export default {
  name: 'player',
  data () {
    return {
      songReady: false,
      currentTime: 0
    }
  },
  computed: {
    playIcon: function () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon: function () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls: function () {
      return this.playing ? 'play' : 'play pause'
    },
    disabledCls: function () {
      return this.songReady ? '' : 'disable'
    },
    percent: function () {
      return this.currentTime / this.currentSong.duration
    },
    iconMode: function () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'sequenceList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode'
    ])
  },
  methods: {
    enter: function (el, done) {
      const { x, y, scale } = this._getPosAndScale()
      let animation = {
        0: {
          transfrom: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transfrom: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transfrom: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter: function (el) {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave: function (el, done) {
      this.$refs.cdWrapper.style.transtion = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style.transfrom = `translate3d(${x}, ${y}, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave: function (el) {
      this.$refs.cdWrapper.style.transtion = ''
      this.$refs.cdWrapper.style.transfrom = ''
    },
    togglePlaying: function () {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    prev: function () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    next: function () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    ready: function () {
      this.songReady = true
    },
    error: function () {
      this.songReady = true
    },
    updataTime: function (e) {
      this.currentTime = e.target.currentTime
    },
    format: function (interval) {
      interval = interval | 0
      const minutes = interval / 60 | 0
      const seconds = this._pad(interval % 60)
      return `${minutes}:${seconds}`
    },
    onProgressBarChange: function (percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    changeMode: function () {
      const mode = (this.mode + 1) % 3
      console.log(mode)
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    _pad: function (num, n = 2) {
      let len = num.toString().length
      if (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosAndScale: function () {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerWidth - paddingTop - width / 2 - paddingBottom

      return {
        x,
        y,
        scale
      }
    },
    back: function () {
      this.setFullScreen(false)
    },
    _setFullScreen: function () {
      this.setFullScreen(true)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    })
  },
  watch: {
    currentSong: function (newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      this.$nextTick(() => {
        return this.$refs.audio.play()
      })
    },
    playing: function (newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/variable"
@import "~@/common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      opacity: 1
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all .4s
        .top, .bottom
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
