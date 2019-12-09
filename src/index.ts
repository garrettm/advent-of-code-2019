import run from './7'

async function runLog() {
  try {
    console.time('run')
    const result = await run()
    console.timeEnd('run')
    console.log('result: ', result)
  }
  catch (error) {
    console.log('error: ', error)
  }
}

runLog()