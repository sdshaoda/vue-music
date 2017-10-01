// 使用的是第三方处理storage的插件
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// 加载浏览器中的搜索历史缓存
export function loadSearch(query) {
  return storage.get(SEARCH_KEY, [])
}

// 缓存搜索历史
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 插入数据 数据顺序从新到旧 不超过最大长度
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  } else if (index > 0) {
    // 数组中有的话 删去
    arr.splice(index, 1)
  }
  // 插入在最前
  arr.unshift(val)
  // 不超过最大长度
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}