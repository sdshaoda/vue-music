import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

// 获取热门搜索词
export function getHotKeys() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}
