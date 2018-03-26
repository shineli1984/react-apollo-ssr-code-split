import React from 'react'
import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'
import { clearChunks, flushChunkNames } from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import configureStore from './configureStore'
import App from '../src/components/App'
import getClient from '../src/apollo/getClient'

export default ({ clientStats }) => async (req, res, next) => {
  const store = await configureStore(req, res)
  if (!store) return // no store means redirect was already served

  // get REDUX state
  const stateJson = JSON.stringify(store.getState())

  // get Apollo Client
  const client = getClient(true)

  const app = (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Provider>
  )

  // SSR
  return getDataFromTree(app)
    .then(() => {
      const initialState = client.extract()

      // This is safe.
      clearChunks()
      let appString = ''
      try {
        appString = ReactDOM.renderToString(app)
      } catch (e) {
        console.log(e)
        throw e
      }

      const chunkNames = flushChunkNames()
      const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames })

      res.send(`<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title></title>
          ${styles}
        </head>
        <body>
          <script>window.REDUX_STATE = ${stateJson}</script>
          <script>window.__APOLLO_STATE__=${JSON.stringify(
            initialState
          ).replace(/</g, '\\\u003c')};</script>
          <div id="root">${appString}</div>
          ${cssHash}
          <script type='text/javascript' src='/static/vendor.js'></script>
          ${js}
        </body>
      </html>`)
    })
    .catch(e => {
      console.log(e)
      throw e
    })

  // // NO SSR VERSION
  // const appString = ReactDOM.renderToString(app)
  // const chunkNames = flushChunkNames()
  // const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames })
  //
  // res.send(`<!doctype html>
  //   <html>
  //     <head>
  //       <meta charset="utf-8">
  //       <title>redux-first-router-demo</title>
  //       ${styles}
  //     </head>
  //     <body>
  //       <script>window.REDUX_STATE = ${stateJson}</script>
  //       <div id="root">${appString}</div>
  //       ${cssHash}
  //       <script type='text/javascript' src='/static/vendor.js'></script>
  //       ${js}
  //     </body>
  //   </html>`)
}
