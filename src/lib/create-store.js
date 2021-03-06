export default function createStore(initialState) {
  let state = initialState
  const listeners = []

  function dispatch() {
    listeners.forEach(listener => listener())
  }

  return {
    getState() {
      return state
    },
    setState(nextState) {
      state = nextState
      dispatch()
    },
    updateState(increment) {
      Object.assign(state, increment)
      dispatch()
    },
    subscribe(listener) {
      listeners.push(listener)

      return function unsubscribe() {
        listeners.splice(listeners.indexOf(listener), 1)
      }
    }
  }
}
