import * as input from './input'

const data = input.readFile(8)

type Layer = number[][]

function readLayers(data: string, width = 25, height = 6) {
  const layers: Layer[] = []
  let n = 0
  const numLayers = data.length / (width * height)
  console.log('data.length: ', data.length, '  numLayers: ', numLayers)

  for (let i = 0; i < numLayers; i++) {
    const layer: Layer = []
    for (let y = 0; y < height; y++) {
      const row: number[] = []
      for (let x = 0; x < width; x++) {
        const value = parseInt(data[n])
        row.push(value)
        n++
      }
      layer.push(row)
    }
    layers.push(layer)
  }
  return layers
}

function iterLayer(layer: Layer, fn: (n: number, y: number, x: number) => void) {
  for (let y = 0; y < layer.length; y++) {
    const row = layer[y]
    for (let x = 0; x < row.length; x++) {
      const n = row[x]
      fn(n, y, x)
    }
  }
}

function partOne() {
  const layers = readLayers(data)
  let winnerZeroes = 999999999
  let winner: Layer | undefined

  for (const layer of layers) {
    let numZeroes = 0
    iterLayer(layer, n => {
      if (n === 0) {
        numZeroes++
      }
    })

    if (numZeroes < winnerZeroes) {
      winnerZeroes = numZeroes
      winner = layer
    }
  }

  const byDigit = new Array(10).fill(0)
  iterLayer(winner!, n => {
    byDigit[n]++
  })

  return {product: byDigit[1] * byDigit[2], byDigit}
}

/* 
  Result part 2:
  LBRCE ?
  [ 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0 ],
  [ 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0 ],
  [ 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0 ],
  [ 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
  [ 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0 ],
  [ 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0 ]
*/

function partTwo() {
  const layers = readLayers(data)
  const result: Layer = new Array(layers[0].length).fill(0).map(_ => [])
  iterLayer(layers[0], (_, y, x) => {
    for (const layer of layers) {
      const n = layer[y][x]
      if (n === 0 || n === 1) {
        result[y][x] = n
        return
      }
    }
  })
  return result
}

export default partTwo