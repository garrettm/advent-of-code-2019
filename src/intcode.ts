import * as readline from 'readline'
import {PushableGenerator} from './pushable'

export type Input = (() => number | Promise<number>) | number[] | AsyncIterator<number, undefined, never>
export type Output = ((n: number) => void) | PushableGenerator
export type IO = {
  input: Input
  output: Output
  debug?: boolean
}

export class IntcodeCPU {
  constructor(public state: State, public name?: string, public io?: IO) {}

  async execute(io = this.io) {
    const final = await executeIO(this.state, this.name, io)
    this.state = final
  }
}

export type State = {
  memory: number[]
  position: number
}

function replace<A>(as: A[], index: number, a: A) {
  if (index >= as.length) { throw new Error('out of bounds') }
  const copy = [...as]
  copy[index] = a
  return copy
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const getInput = async () => new Promise<number>(res => {
  rl.question('Provide input: ', input => {
    res(parseInt(input))
  })
})

export async function executeIO(input: State, name = 'Unknown', io = defaultIO): Promise<State> {
  let state = input
  const history = [input]
  while (state.memory[state.position] !== 99) {
    if (history.length > 13) { debugger }
    state = await step(state, name, io)
    history.push(state)
  }
  return state
}

const defaultIO: IO = {
  input: getInput,
  output: n => console.log(`Value is: ${n}`)
}

function readInput(input: Input): number | Promise<number | undefined> | undefined {
  if (typeof input === 'function') {
    return input() 
  }

  if (Array.isArray(input)) {
    return input.shift()
  }

  return input.next().then(({done, value}) => {
    if (done) { return undefined }
    return value
  })
}

function writeOutput(output: Output, n: number) {
  if (typeof output === 'function') {
    output(n)
  }
  else {
    output.push(n)
  }
}

export async function step(state: State, name: string, io: IO): Promise<State> {
  const {memory, position} = state
  let nextMemory = memory
  const extractFrom = memory.slice(position, position + 4)
  const [opAndParameter, parameterA, parameterB, parameterC] = extractFrom
  const op = opAndParameter % 100
  const parameterModeA = (opAndParameter / 100 | 0) % 10 as 0 | 1
  const parameterModeB = (opAndParameter / 1000 | 0) % 10 as 0 | 1
  const parameterModeC = (opAndParameter / 10000 | 0) % 10 as 0 | 1
  const valueA = parameterModeA === 0 ? memory[parameterA] : parameterA
  const valueB = parameterModeB === 0 ? memory[parameterB] : parameterB
  const valueC = parameterModeC === 0 ? memory[parameterC] : parameterC

  // console.log('Running: ', {position: state.position, extractFrom, opAndParameter, op, parameterModeA, parameterModeB, parameterModeC, valueA, valueB, valueC, parameterA, parameterB, parameterC})

  let nextPosition = position + 4

  switch (op) {
    case 1: 
      nextMemory = replace(memory, parameterC, valueA + valueB)
      break

    case 2:
      nextMemory = replace(memory, parameterC, valueA * valueB)
      break

    case 3:
      if (io.debug) console.log(name, 'reading')
      const inputValue = await readInput(io.input)
      if (io.debug) console.log(name, 'read', inputValue)
      if (typeof inputValue !== 'number' || isNaN(inputValue)) {
        console.log('Input error: invalid value  (', inputValue, ')')
        throw new Error('Input error: invalue value')
      }
      nextPosition = position + 2
      nextMemory = replace(memory, parameterA, inputValue)
      break

    case 4:
      if (io.debug) console.log('Writing: ', name, '-->', valueA)
      nextPosition = position + 2
      writeOutput(io.output, valueA)
      break

    case 5:
      if (valueA !== 0) {
        nextPosition = valueB
      }
      else {
        nextPosition = position + 3
      }
      break

    case 6:
      if (valueA === 0) {
        nextPosition = valueB
      }
      else {
        nextPosition = position + 3
      }
      break

    case 7: 
      const lessThanValue = valueA < valueB ? 1 : 0
      nextMemory = replace(memory, parameterC, lessThanValue)
      break

    case 8:
      const eqValue = valueA === valueB ? 1 : 0
      nextMemory = replace(memory, parameterC, eqValue)
      break

    case 99: return state

    default: throw new TypeError
  }

  return {
    memory: nextMemory,
    position: nextPosition
  }
}