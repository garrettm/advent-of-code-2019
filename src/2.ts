import * as input from './input'

type State = {
  data: number[]
  position: number
}

function replace<A>(as: A[], index: number, a: A) {
  const copy = [...as]
  copy[index] = a
  return copy
}

function execute(state: State): State {
  const {data, position} = state
  let nextData = data
  const [op, inputLocationLeft, inputLocationRight, resultLocation] = data.slice(position)
  const inputLeft = data[inputLocationLeft]
  const inputRight = data[inputLocationRight]
  switch (data[position]) {
    case 1: 
      nextData = replace(data, resultLocation, inputLeft + inputRight)
      break

    case 2:
      nextData = replace(data, resultLocation, inputLeft * inputRight)
      break

    case 99: return state

    default: throw new TypeError
  }

  return {
    data: nextData,
    position: position + 4
  }
}

function readData() {

}

function partOne() {

}

function partTwo() {

}

export default partOne