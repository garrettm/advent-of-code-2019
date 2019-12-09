export type PushableGenerator<A = number> = AsyncGenerator<A, undefined, undefined> & {push: (n: A) => void}

let p = 0
export function pushable<A = number>(...iterators: (Iterable<A>)[]): PushableGenerator<A> {
  const pullQueue: ((res: IteratorResult<A, undefined>) => void)[] = []
  const pushQueue: A[] = []

  function pushValue(a: A) {
    if (pullQueue.length !== 0) {
      pullQueue.shift()!({ value: a, done: false })
    }
    else {
      pushQueue.push(a)
    }
  }

  function prependIterators() {
    for (const iterator of iterators) {
      for (const value of iterator) {
        pushValue(value)
      }
    }
  }
  prependIterators()

  function emptyQueue() {
    console.log('Pushable emptying!')
    for (const resolve of pullQueue) {
      resolve({value: undefined, done: true})
    }
    pullQueue.length = 0
    pushQueue.length = 0
  }

  const me = p++

  return {
    next() {
      return new Promise<IteratorResult<A, undefined>>(res => {
        if (pushQueue.length !== 0) {
          res({value: pushQueue.shift()!, done: false})
        }
        else {
          pullQueue.push(res)
        }
      })
    },
    return() {
      emptyQueue()
      return Promise.resolve({done: true, value: undefined as any})
    },
    throw(e) {
      emptyQueue()
      return Promise.reject(e)
    },
    push(a) {
      pushValue(a)
    },
    [Symbol.asyncIterator]() {
      return this 
    }
  }
}