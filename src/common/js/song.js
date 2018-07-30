import { getLyric, getSongsUrl } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

// 使用类来创建对象
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    // 当前歌曲存在时，返回成功时的回调函数
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    // 返回 Promise 对象
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

// 工厂方法 将原始歌曲数据转换为期望的数据格式
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
  })
}

// 原始的 singer 是一个数组，将其转换为以 '/' 相隔的字符串
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

// 添加歌曲资源URL
export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  // 通过api获取
  return getSongsUrl(songs).then((res) => {
    if (res.code === ERR_OK) {
      res.url_mid.data.midurlinfo.forEach((info, index) => {
        songs[index].url = info.purl
      })
      // 过滤掉没有歌曲URL资源的
      songs = songs.filter(song => song.url.length)
    }
    return songs
  })
}
