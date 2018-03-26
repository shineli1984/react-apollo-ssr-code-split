import { compose, contains } from 'ramda'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import SelectPokemon from './SelectPokemon'

const SELECT_POKEMON = gql`
  mutation selectPokemon($pokemonId: ID) {
    selectPokemon(pokemonId: $pokemonId) @client
  }
`

const SELECTED_POKEMONS = gql`
  query {
    selectedPokemons @client {
      pokemons
    }
  }
`

export default compose(
  graphql(SELECT_POKEMON, {
    props: ({ ownProps: { pokemonId }, mutate }) => ({
      onSelect: () => mutate({ variables: { pokemonId } })
    })
  }),
  graphql(SELECTED_POKEMONS, {
    props: ({
      ownProps: { pokemonId },
      data: { selectedPokemons: { pokemons } }
    }) => ({
      selected: contains(pokemonId, pokemons)
    })
  })
)(SelectPokemon)
