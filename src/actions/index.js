import { NOT_FOUND } from 'redux-first-router'

export const goHome = () => ({
  type: 'HOME'
})

export const notFound = () => ({
  type: NOT_FOUND
})
