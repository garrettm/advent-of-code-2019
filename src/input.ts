import * as fs from 'fs'
import {EOL} from 'os'

export function readFile(name: number | string) {
  return fs.readFileSync(`./input/${name}.txt`, {encoding: 'utf8'})
}

export function read(name: number | string) {
  return fs.readFileSync(`./input/${name}.txt`, {encoding: 'utf8'}).split(EOL)
}
