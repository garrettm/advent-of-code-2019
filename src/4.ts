
const low = 108457
const high = 562041

function countConsecutive(str: string, from: number) {
  const target = str[from]
  let i = 1
  while (from + i < str.length) {
    if (str[from + i] === target) {
      i++
    }
    else {
      break
    }
  }
  return i
}

function matches(n: number) {
  const str = n.toString()
  let consecutive = false
  let i = 0
  while (i < str.length) {
    const consec = countConsecutive(str, i)
    if (consec === 2) {
      consecutive = true
      break
    }
    else {
      i += consec
    }
  }
  if (!consecutive) { return false }

  let last = -1
  for (let i = 0; i < str.length; i++) {
    const parsed = parseInt(str[i])
    if (last > parsed) {
      return false
    }
    last = parsed
  }

  return true
}

function scan() {
  const hits: number[] = []
  for (let i = low; i <= high; i++) {
    if (matches(i)) {
      hits.push(i)
    }
  }
  return hits.length
}

export default scan