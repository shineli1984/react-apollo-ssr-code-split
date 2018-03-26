import { compose } from 'ramda'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { flattenProp } from 'recompose'
import PokemonsList from './Home'
import PokemonsListItem from './PokemonsListItemContainer'
import withLoading from '../utils/hoc/withLoading'

/**
 * General component description in JSDoc format. Markdown is *supported*
 */
export default compose(
  graphql(
    gql`
      query Pokemons($first: Int!) {
        pokemons(first: $first) {
          id
          number
          ...PokemonsListItem
        }
      }
      ${PokemonsListItem.fragments.pokemon}
    `,
    {
      options: {
        variables: {
          first: 2
        }
      },
      props: ({ data: { fetchMore, refetch, ...rest } }) => ({
        data: {
          ...rest,
          fetchMore: () =>
            fetchMore({
              variables: {
                first: rest.pokemons.length + 2
              },
              updateQuery: (previousResult, { fetchMoreResult }) => ({
                ...previousResult,
                pokemons: fetchMoreResult.pokemons
              })
            }),
          refetch: () => refetch({ first: rest.pokemons.length })
        }
      })
    }
  ),
  flattenProp('data'),
  withLoading
)(PokemonsList)
