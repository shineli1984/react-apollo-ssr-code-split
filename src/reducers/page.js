import { NOT_FOUND } from 'redux-first-router'

export default (state = 'HOME', action = {}) => components[action.type] || state

const components = {
  HOME: 'HomeContainer',
  POKEMON: 'PokemonContainer',
  [NOT_FOUND]: 'NotFound'
}
