import originJSONP from 'jsonp'

// 对jsonp库进行Promise封装
export default function jsonp (url, data, option) {
  // 将 data 拼接至 url
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 将数组拼接成 查询字符串
function param (data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    // encodeURIComponent函数把字符串作为URI组件进行编码转义
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
