import * as input from './input'
import {IntcodeCPU, State, defaultIO} from './intcode'

const quine = `109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99` 
const sixteenDigit = `1102,34915192,34915192,7,4,7,99,0`
const a = `109, -1, 4, 1, 99` // outputs -1
const b = `109, -1, 104, 1, 99` // outputs 1
const c = `109, -1, 204, 1, 99` // outputs 109
const d = `109, 1, 9, 2, 204, -6, 99` // outputs 204
const e = `109, 1, 109, 9, 204, -6, 99` // outputs 204
const f = `109, 1, 209, -1, 204, -106, 99` // outputs 204
const g = `109, 1, 3, 3, 204, 2, 99` // outputs the input
const h = `109, 1, 203, 2, 204, 2, 99` // outputs the input

const data = input.readFile(9)
const memory = data.split(',').map(n => BigInt(parseInt(n)))

async function partOne() {
  const cpu = IntcodeCPU.from(memory)
  const finalState = await cpu.execute({...defaultIO, input: [1n], debug: false})
  return finalState
}

function partTwo() {

}

export default partOne