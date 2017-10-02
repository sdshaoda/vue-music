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
  insertToArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 删除搜索历史
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清除所有搜索历史
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 插入数据 数据顺序从新到旧 不超过最大长度
function insertToArray(arr, val, compare, maxLen) {
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

// 从数组中删除一个元素 若有
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}