import * as input from './input'

type State = {
  memory: number[]
  position: number
}

function replace<A>(as: A[], index: number, a: A) {
  const copy = [...as]
  copy[index] = a
  return copy
}

function execute(state: State): State {
  const {memory, position} = state
  let nextMemory = memory
  const [op, inputLocationLeft, inputLocationRight, resultLocation] = memory.slice(position)
  const inputLeft = memory[inputLocationLeft]
  const inputRight = memory[inputLocationRight]
  switch (memory[position]) {
    case 1: 
      nextMemory = replace(memory, resultLocation, inputLeft + inputRight)
      break

    case 2:
      nextMemory = replace(memory, resultLocation, inputLeft * inputRight)
      break

    case 99: return state

    default: throw new TypeError
  }

  return {
    memory: nextMemory,
    position: position + 4
  }
}

function executeUntilCompletion(input: State): State {
  let state = input
  while (state.memory[state.position] !== 99) {
    state = execute(state)
  }
  return state
}

const initialMemory = input.read(2).split(',').filter(n => n).map(n => parseInt(n))

function initialState(noun = 12, verb = 2): State {
  const memory = [...initialMemory]
  memory[1] = noun
  memory[2] = verb
  return {
    memory,
    position: 0
  }
}

function partOne() {
  const final = executeUntilCompletion(initialState())
  return final.memory[0]
}

function partTwo() {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      const state = executeUntilCompletion(initialState(noun, verb))
      if (state.memory[0] === 19690720) {
        return 100 * noun + verb
      }
    }
  }
  throw new Error
}

export default partTwo