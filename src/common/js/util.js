// 洗牌函数
export function shuffle (arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    let j = getRandomInt(0, i)
    let t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
  }
  return arr
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
