import * as input from './input'

function readPaths() {
  const paths = input.read(3).split('\n')
  return [readPath(paths[0]), readPath(paths[1])]
}

type Point = undefined | number
type Points = {
  [key: number]: Point
}

type Path = {
  data: Points[]
}

const size = 20000
const originX = size / 2
const originY = originX

function readPath(path: string): Path {
  const data: Points[] = new Array(size).fill(0).map((_, i) => ({}))
  const instructions = path.split(',')
  let x = originX, y = originY
  let travel = 0

  const write = () => {
    if (data[y][x] === undefined) {
      data[y][x] = travel
    }
    travel++
  }

  for (const instruction of instructions) {
    const command = instruction[0]
    const distance = parseInt(instruction.slice(1))
    const ensure = (target: number) => {
      if (target < 0 || target > size) { throw new TypeError('target is out of range: ' + target + JSON.stringify({command, distance, x, y})) }
    }

    switch (command) {
      case 'R': {
        const target = x + distance
        ensure(target)
        while (x < target) {
          write()
          x++
        }
        break
      }

      case 'U': {
        const target = y + distance
        ensure(target)
        while (y < target) {
          write()
          y++
        }
        break
      }

      case 'L': {
        const target = x - distance
        ensure(target)
        while (x > target) {
          write()
          x--
        }
        break
      }

      case 'D': {
        const target = y - distance
        ensure(target)
        while (y > target) {
          write()
          y--
        }
        break
      }

      default: throw new TypeError
    }
  }
  return {data}
}

type Intersection = {x: number, y: number, travel: number}
function findIntersections({data: one}: Path, {data: two}: Path) {
  const intersections: Intersection[] = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (one[y][x] !== undefined && two[y][x] !== undefined && (x !== originX || y !== originY)) {
        intersections.push({x, y, travel: one[y][x]! + two[y][x]!})
      }
    }
  }
  return intersections
}

function manhattanDistanceOfIntersection(intersection: Intersection) {
  return Math.abs(intersection.x - originX) + Math.abs(intersection.y - originY)
}

function partOne() {
  const [one, two] = readPaths()
  const intersections = findIntersections(one, two)
  return Math.min(...intersections.map(manhattanDistanceOfIntersection))
}

function partTwo() {
  const [one, two] = readPaths()
  const intersections = findIntersections(one, two)
  return Math.min(...intersections.map(i => i.travel))
}

export default partTwo