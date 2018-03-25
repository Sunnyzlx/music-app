<template lang="pug">
  div.recommend
    scroll.recommend-content(:data="discList",ref="scroll")
      div
        div.slider-wrapper(v-if="recommends.length")
          slider
            div(v-for="item in recommends")
              a(:href="item.linkUrl")
                img(:src="item.picUrl",@load="loadImage")
        div.recommend-list
          h1.list-title 热门歌单推荐
          ul
            li.item(v-for="item in discList")
              div.icon
                img(width="60", height="60", :src="item.imgurl")
              div.text
                h2.name(v-html="item.creator.name")
                p.desc(v-html="item.dissname")
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll'
import Slider from '@/base/slider/slider'
import { getRecommend, getDiscList } from '@/api/recommend.js'
import { ERR_OK } from '@/api/config.js'

export default {
  name: 'recommend',
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created: function () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    _getRecommend: function () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList: function () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    loadImage: function () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
  components: {
    Slider,
    Scroll
  }
}
</script>

<style lang="stylus">
@import "~@/common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
