import * as readline from 'readline'
import {PushableGenerator} from './pushable'

export type Input = (() => bigint | Promise<bigint>) | bigint[] | AsyncIterator<bigint, undefined, never>
export type Output = ((n: bigint) => void) | PushableGenerator
export type IO = {
  input: Input
  output: Output
  debug?: boolean
}

export type ParameterMode = 0 | 1 | 2
export type Memory = bigint[]
export type State = {
  memory: Memory
  relativeBase: number
  position: number
}

export class IntcodeCPU {
  static from(memory: bigint[], relativeBase = 0, position = 0) {
    return new IntcodeCPU({memory, relativeBase, position})
  }

  constructor(public state: State, public name?: string, public io?: IO) {}

  async execute(io = this.io) {
    const final = await executeIO(this.state, this.name, io)
    this.state = final
    return final
  }
}

function replace<A>(as: A[], index: number, a: A, io: IO) {
  const copy = [...as]
  if (io.debug) console.log('replacing index ', index, ' with ', a)
  if (index >= as.length) {
    if (io.debug) console.log('extending array from ', as.length, ' to ', index + 1)
    copy.length = index + 1
  }
  copy[index] = a
  return copy
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const getInput = async () => new Promise<bigint>(res => {
  rl.question('Provide input: ', input => {
    res(BigInt(parseInt(input)))
  })
})

export async function executeIO(input: State, name = 'Unknown', io = defaultIO): Promise<State> {
  let state = input
  const history = [input]
  while (state.memory[state.position] !== 99n) {
    if (history.length > 13) { debugger }
    state = await step(state, name, io)
    history.push(state)
  }
  return state
}

export const defaultIO: IO = {
  input: getInput,
  output: n => console.log(`[Output] ${n}`)
}

function readInput(input: Input): bigint | Promise<bigint | undefined> | undefined {
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

function writeOutput(output: Output, n: bigint) {
  if (typeof output === 'function') {
    output(n)
  }
  else {
    output.push(n)
  }
}

function interpretedValue(parameterMode: ParameterMode, parameter: bigint, relativeBase: number, memory: Memory) {
  switch (parameterMode) {
    case 0: return memory[Number(parameter)] || 0n
    case 1: return parameter
    case 2: return memory[Number(parameter) + relativeBase] || 0n
    // case 2: return memory[Number(parameter) + relativeBase] || 0n
  }
}

function literalMode(parameterMode: ParameterMode, parameter: bigint, relativeBase: number) {
  return Number(parameter) + (parameterMode === 2 ? relativeBase : 0)
}

export async function step(state: State, name: string, io: IO): Promise<State> {
  const {memory, position} = state
  let {memory: nextMemory, relativeBase} = state
  const extractFrom = memory.slice(position, position + 4)
  const [opAndParameter, parameterA, parameterB, parameterC] = extractFrom
  const op = opAndParameter % 100n
  const parameterModeA = (Number(opAndParameter) / 100 | 0) % 10 as ParameterMode
  const parameterModeB = (Number(opAndParameter) / 1000 | 0) % 10 as ParameterMode
  const parameterModeC = (Number(opAndParameter) / 10000 | 0) % 10 as ParameterMode
  const valueA = interpretedValue(parameterModeA, parameterA, relativeBase, memory)
  const valueB = interpretedValue(parameterModeB, parameterB, relativeBase, memory)
  const memorySlotC = literalMode(parameterModeC, parameterC, relativeBase)
  // const valueC = interpretedValue(parameterModeC, parameterC, relativeBase, memory)

  if (io.debug) {
    console.log('Running: ', {position, extractFrom, opAndParameter, op, parameterModeA, parameterModeB, parameterModeC, valueA, valueB, memorySlotC, parameterA, parameterB, parameterC, relativeBase})
    debugger
  }

  let nextPosition = position + 4

  switch (op) {
    case 1n: 
      nextMemory = replace(memory, memorySlotC, valueA + valueB, io)
      break

    case 2n:
      nextMemory = replace(memory, memorySlotC, valueA * valueB, io)
      break

    case 3n:
      const writeTo = literalMode(parameterModeA, parameterA, relativeBase)
      if (io.debug) console.log(name, 'reading to index: ', writeTo)
      const inputValue = await readInput(io.input)
      if (io.debug) console.log(name, 'read', inputValue)
      if (typeof inputValue !== 'bigint') {
        console.log('Input error: invalid value  (', inputValue, ')')
        throw new Error('Input error: invalue value')
      }
      nextPosition = position + 2
      nextMemory = replace(memory, writeTo, inputValue, io)
      break

    case 4n:
      if (io.debug) console.log('Writing: ', name, '-->', valueA)
      nextPosition = position + 2
      writeOutput(io.output, valueA)
      break

    case 5n:
      if (valueA !== 0n) {
        nextPosition = Number(valueB)
      }
      else {
        nextPosition = position + 3
      }
      break

    case 6n:
      if (valueA === 0n) {
        nextPosition = Number(valueB)
      }
      else {
        nextPosition = position + 3
      }
      break

    case 7n: 
      const lessThanValue = valueA < valueB ? 1n : 0n
      nextMemory = replace(memory, memorySlotC, lessThanValue, io)
      break

    case 8n:
      const eqValue = valueA === valueB ? 1n : 0n
      nextMemory = replace(memory, memorySlotC, eqValue, io)
      break

    case 9n: 
      relativeBase += Number(valueA)
      nextPosition = position + 2
      break

    case 99n: return state

    default: throw new TypeError(`Unexpected values: ${extractFrom}`)
  }

  return {
    memory: nextMemory,
    relativeBase,
    position: nextPosition
  }
}