import * as input from './input'
import {State, executeIO} from './intcode'

const data = input.readFile(5)
// const data = `3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`
const initialMemory = data.split(',').map(n => BigInt(parseInt(n)))
const initialState: State = {
  memory: initialMemory,
  relativeBase: 0,
  position: 0
}

async function exec() {
  const finalState = await executeIO(initialState)
  return finalState
}

export default exec