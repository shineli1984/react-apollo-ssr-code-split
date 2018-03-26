import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import resolvers from '../resolvers'
import defaults from '../defaults'

const getClient = isServer => {
  const cache = isServer
    ? new InMemoryCache()
    : new InMemoryCache().restore(window.__APOLLO_STATE__)

  const httpLink = createHttpLink({
    uri: 'https://graphql-pokemon.now.sh/?'
  })

  const stateLink = withClientState({
    cache,
    defaults,
    resolvers
  })

  return new ApolloClient({
    link: stateLink.concat(httpLink),
    cache,
    ssrMode: isServer
  })
}

export default getClient
