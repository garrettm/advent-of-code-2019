import run from './8'

async function runLog() {
  try {
    console.time('run')
    const result = await run()
    console.timeEnd('run')
    console.log('result: \n', result)
  }
  catch (error) {
    console.log('error: ', error)
  }
}

runLog()