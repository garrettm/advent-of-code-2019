import * as input from './input'
import {IntcodeCPU, IO, Input} from './intcode'
import {pushable} from './pushable'

const data = input.readFile(7)
// const data = `3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`
const memory = data.split(',').map(n => BigInt(parseInt(n)))
const initial = {memory, relativeBase: 0, position: 0}

async function partOne() {
  let max = BigInt(Number.MIN_VALUE)

  for (let a = 0; a < 5; a++) {
    for (let b = 0; b < 5; b++) {
      if (a === b) { continue }

      for (let c = 0; c < 5; c++) {
        if (c === a || c === b) { continue }

        for (let d = 0; d < 5; d++) {
          if (d === a || d === b || d === c) { continue }

          for (let e = 0; e < 5; e++) {
            if (e === a || e === b || e === c || e === d) { continue }

            let signal = 0n
            function output(n: bigint) {
              console.log('output: ', n)
              signal = n
            }

            console.log('[one] running: ', [a, b, c, d, e])

            const ampA = new IntcodeCPU(initial)
            await ampA.execute({
              input: [BigInt(a), signal],
              output
            })

            const ampB = new IntcodeCPU(initial)
            await ampB.execute({
              input: [BigInt(b), signal],
              output
            })

            const ampC = new IntcodeCPU(initial)
            await ampC.execute({
              input: [BigInt(c), signal],
              output
            })

            const ampD = new IntcodeCPU(initial)
            await ampD.execute({
              input: [BigInt(d), signal],
              output
            })

            const ampE = new IntcodeCPU(initial)
            await ampE.execute({
              input: [BigInt(e), signal],
              output
            })

            if (signal > max) {
              max = signal
            }
          }
        }
      }
    }
  }
  return max
}

async function partTwo() {
  const MIN = 5
  const MAX = 10
  let max = BigInt(Number.MIN_VALUE)

  for (let a = MIN; a < MAX; a++) {
    for (let b = MIN; b < MAX; b++) {
      if (a === b) { continue }

      for (let c = MIN; c < MAX; c++) {
        if (c === a || c === b) { continue }

        for (let d = MIN; d < MAX; d++) {
          if (d === a || d === b || d === c) { continue }

          for (let e = MIN; e < MAX; e++) {
            if (e === a || e === b || e === c || e === d) { continue }
            console.log('[two] running: ', [a, b, c, d, e])

            const ampA = new IntcodeCPU(initial, 'A')
            const ampB = new IntcodeCPU(initial, 'B')
            const ampC = new IntcodeCPU(initial, 'C')
            const ampD = new IntcodeCPU(initial, 'D')
            const ampE = new IntcodeCPU(initial, 'E')

            let eSignal: bigint = NaN as any

            const aInput = pushable([BigInt(a), 0n])
            const aOutput = pushable()
            const bInput = pushable([BigInt(b)])
            const bOutput = pushable()
            const cInput = pushable([BigInt(c)])
            const cOutput = pushable()
            const dInput = pushable([BigInt(d)])
            const dOutput = pushable()
            const eInput = pushable([BigInt(e)])
            const eOutput = pushable()

            async function forwardA() {
              for await (const value of aOutput) {
                bInput.push(value)
              }
            }
            forwardA()

            async function forwardB() {
              for await (const value of bOutput) {
                cInput.push(value)
              }
            }
            forwardB()

            async function forwardC() {
              for await (const value of cOutput) {
                dInput.push(value)
              }
            }
            forwardC()

            async function forwardD() {
              for await (const value of dOutput) {
                eInput.push(value)
              }
            }
            forwardD()

            async function forwardE() {
              for await (const value of eOutput) {
                eSignal = value
                aInput.push(value)
              }
            }
            forwardE()

            const execA = ampA.execute({
              input: aInput,
              output: aOutput
            })

            const execB = ampB.execute({
              input: bInput,
              output: bOutput
            })

            const execC = ampC.execute({
              input: cInput,
              output: cOutput
            })

            const execD = ampD.execute({
              input: dInput,
              output: dOutput
            })

            const execE = ampE.execute({
              input: eInput,
              output: eOutput
            })

            await execA
            await execB
            await execC
            await execD
            await execE
            
            max = eSignal > max ? eSignal : max
          }
        }
      }
    }
  }

  return max
}

export default partTwo