// 返回 [min, max] 之间的整数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 打乱数组 且不对原数组造成影响
export function shuffle(arr) {
  // arr 按值传递的是数组地址
  let newArr = arr.slice()
  for (let i = 0; i < newArr.length; i++) {
    let j = getRandomInt(0, i)
    let t = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = t
  }
  return newArr
}
