import gql from 'graphql-tag'
import PokemonsListItem from './PokemonsListItem'

PokemonsListItem.fragments = {
  pokemon: gql`
    fragment PokemonsListItem on Pokemon {
      id
      name
      image
    }
  `
}

export default PokemonsListItem
