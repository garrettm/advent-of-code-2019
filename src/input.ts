import * as fs from 'fs'

export function read(name: number | string) {
  return fs.readFileSync(`./input/${name}.txt`, {encoding: 'utf8'})
}
