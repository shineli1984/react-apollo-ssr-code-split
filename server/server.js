import React from 'react'
import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'
import { clearChunks, flushChunkNames } from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import configureStore from '../src/configureStore'
import App from '../src/components/App'
import getClient from '../src/apollo/getClient'
import clientStats from '../buildClient/stats.json'
import createHistory from 'history/createMemoryHistory'
import { NOT_FOUND } from 'redux-first-router'

export default (event, context, callback) => {
  const request = event.Records[0].cf.request
  const path = request.uri
  const querystring = request.querystring
  const url = path + '?' + querystring

  if (path.indexOf('.') > 0) {
    return callback(null, request)
  }

  const preLoadedState = {} // onBeforeChange will authenticate using this
  const history = createHistory({ initialEntries: [url] })
  const { store, thunk } = configureStore(history, preLoadedState)

  let location = store.getState().location
  if (doesRedirect(location)) {
    callback(null, responseForRedirectToPath(location.pathname))
  } else {
    thunk(store)
      .then(() => {
        location = store.getState().location
        if (doesRedirect(location)) {
          return responseForRedirectToPath(location.pathname)
        }
        // status code
        const status = location.type === NOT_FOUND ? 404 : 200

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

        return getDataFromTree(app).then(() => {
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
          const { js, styles, cssHash } = flushChunks(clientStats, {
            chunkNames
          })

          const body = `<!doctype html>
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
            </html>`

          const response = {
            status,
            statusDescription: 'OK',
            headers: {
              'cache-control': [
                {
                  key: 'Cache-Control',
                  value: 'max-age=0'
                }
              ],
              'content-type': [
                {
                  key: 'Content-Type',
                  value: 'text/html'
                }
              ],
              'content-encoding': [
                {
                  key: 'Content-Encoding',
                  value: 'UTF-8'
                }
              ]
            },
            body
          }

          return response
        })
      })
      .then(data => callback(null, data))
      .catch(callback)
  }
}

const doesRedirect = ({ kind }) => kind === 'redirect'

const responseForRedirectToPath = pathname => ({
  status: '302',
  statusDescription: 'Found',
  headers: {
    location: [
      {
        key: 'Location',
        value: pathname
      }
    ]
  }
})
