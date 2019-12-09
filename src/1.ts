import * as input from './input'

type Module = {
  mass: number
}

function fuelRequiredForMass(mass: number) {
  return Math.floor(mass / 3) - 2
}

function readModules(): Module[] {
  const contents = input.readFile(1)
  const lines = contents.split('\n').filter(l => l)
  return lines.map(l => ({mass: parseInt(l)}))
}

function partOne() {
  const modules = readModules()
  return modules.map(m => fuelRequiredForMass(m.mass)).reduce((p, n) => p + n, 0)
}

function fuelRequiredForModule(module: Module) {
  let sum = 0
  let mass = module.mass
  while (true) {
    const next = fuelRequiredForMass(mass)
    if (next <= 0) { return sum }
    sum += next
    mass = next
  }
}

function partTwo() {
  const modules = readModules()
  return modules.map(fuelRequiredForModule).reduce((p, n) => p + n, 0)
}

export default partTwo
