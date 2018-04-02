<template lang="pug">
  div.singer
    list-view(:data="singerList",@select="selectSinger")
    router-view
</template>

<script type="text/ecmascript-6">
import { getSingerList } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import Singer from '@/common/js/singer'
import ListView from '@/base/listview/listview'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'singer',
  data () {
    return {
      singerList: []
    }
  },
  created: function () {
    this._getSingerList()
  },
  components: {
    ListView
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    selectSinger: function (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList: function () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = this._normalizeSinger(res.data.list)
          console.log(this.singerList)
        }
      })
    },
    _normalizeSinger: function (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为了得到有序列表，我们需要处理map
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  }
}
</script>

<style lang="stylus">
.singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
