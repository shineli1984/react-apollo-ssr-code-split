export default (state = 'next', action = {}) => {
  if (!action.meta || !action.meta.location) {
    return state
  }

  const type = action.type
  const prevType = action.meta.location.prev.type

  if (type === prevType) {
    return state
  }
  if (type === 'HOME') {
    return 'back'
  }
  if (prevType === 'HOME') {
    return 'next'
  }
  return state
}

// this is an example of some fun stuff you can do easily trigger animations
// from state. Look into <TransitionGroup /> within components/Switcher.js
