import * as input from './input'
import * as readline from 'readline'

type State = {
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

async function execute(state: State): Promise<State> {
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

  console.log('Running: ', {position: state.position, extractFrom, opAndParameter, op, parameterModeA, parameterModeB, parameterModeC, valueA, valueB, valueC, parameterA, parameterB, parameterC})
  // debugger

  let nextPosition = position + 4

  switch (op) {
    case 1: 
      nextMemory = replace(memory, parameterC, valueA + valueB)
      break

    case 2:
      nextMemory = replace(memory, parameterC, valueA * valueB)
      break

    case 3:
      const inputValue = await getInput()
      nextPosition = position + 2
      nextMemory = replace(memory, parameterA, inputValue)
      break

    case 4:
      nextPosition = position + 2
      console.log(`Value is: ${valueA}`)
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

const data = input.read(5)
// const data = `3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`
const initialMemory = data.split(',').map(n => parseInt(n))
const initialState: State = {
  memory: initialMemory,
  position: 0
}

async function executeUntilCompletion(input: State): Promise<State> {
  let state = input
  const history = [input]
  while (state.memory[state.position] !== 99) {
    if (history.length > 13) { debugger }
    state = await execute(state)
    history.push(state)
  }
  return state
}

async function partOne() {
  const finalState = await executeUntilCompletion(initialState)
  return finalState
}

function partTwo() {
}

export default partOne