import { append, contains, compose, ifElse, path, without } from 'ramda'
import gql from 'graphql-tag'

export default {
  Mutation: {
    selectPokemon: (_, { pokemonId }, { cache }) => {
      const query = gql`
        query {
          selectedPokemons @client {
            pokemons
          }
        }
      `
      const selected = cache.readQuery({ query })
      const data = {
        selectedPokemons: {
          __typename: 'SelectedPokemons',
          pokemons: compose(
            ifElse(
              contains(pokemonId),
              without([pokemonId]),
              append(pokemonId)
            ),
            path(['selectedPokemons', 'pokemons'])
          )(selected)
        }
      }
      cache.writeData({ data })
      return null
    }
  }
}
