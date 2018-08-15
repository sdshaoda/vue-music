// 公用请求头
export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback',
  prefix: 'jp'
}

// 返回'成功'，语义化，便于维护
export const ERR_OK = 0

export const domain = 'https://music.shaoda.tech'
