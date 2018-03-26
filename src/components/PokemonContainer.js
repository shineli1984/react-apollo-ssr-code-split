import { prop } from 'ramda'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Pokemon from './Pokemon'
import withLoading from '../utils/hoc/withLoading'

const query = gql`
  query Pokemon($id: String) {
    pokemon(id: $id) {
      id
      name
      image
      classification
      types
    }
  }
`

export default graphql(query, {
  options: ({ location: { payload: { id } } }) => ({
    variables: {
      id: decodeURIComponent(id)
    }
  }),
  props: prop('data')
})(withLoading(Pokemon))
