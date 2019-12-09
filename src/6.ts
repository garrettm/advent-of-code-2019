import * as input from './input'

type id = string
type Orbits = {
  byOrbiter: {[orbiter: string]: id | undefined}
  byCenter: {[orbitee: string]: id[] | undefined}
}

function readOrbits() {
  const lines = input.read(6)
  const orbits: Orbits = {
    byOrbiter: {},
    byCenter: {}
  }

  for (const line of lines) {
    const [orbitee, orbiter] = line.split(')')
    orbits.byOrbiter[orbiter] = orbitee
    const prior = orbits.byCenter[orbitee]
    if (prior) {
      prior.push(orbiter)
    }
    else {
      orbits.byCenter[orbiter] = [orbitee]
    }
  }
  return orbits
}

const CENTER_OF_MASS = 'COM'

function pathToCOM(orbits: Orbits, input: id) {
  let id = input
  const path: string[] = []
  while (id !== CENTER_OF_MASS) {
    const toCheck = orbits.byOrbiter[id]
    if (!toCheck) { break }
    id = toCheck
    path.push(id)
  }
  return path
}

function partOne() {
  const orbits = readOrbits()
  let sum = 0

  const keys = Object.keys(orbits.byOrbiter)
  for (const key of keys) {
    const path = pathToCOM(orbits, key)
    sum += path.length
  }

  return sum
}

function partTwo() {
  const orbits = readOrbits()
  const pathFromMe = pathToCOM(orbits, 'YOU')
  const pathFromSanta = pathToCOM(orbits, 'SAN')
  for (let i = 0; i < pathFromMe.length; i++) {
    const key = pathFromMe[i]
    const santaPathIdx = pathFromSanta.indexOf(key)
    if (santaPathIdx !== -1) {
      const first = pathFromMe.slice(0, i)
      const second = pathFromSanta.slice(0, santaPathIdx)
      const result = {pathFromMe, pathFromSanta, first, second, transfer: first.length + second.length}
      return result.transfer
    }
  }
  return {pathFromMe, pathFromSanta}
}

export default partTwo