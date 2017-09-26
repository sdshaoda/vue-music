// 使用 new class 创建 object
export default class Singer {
  constructor({ id, name }) {
    this.id = id
    this.name = name
    // 歌手详情页使用 大图
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
    // 歌手列表页使用 小图
    this.smallAvatar = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`
  }
}
