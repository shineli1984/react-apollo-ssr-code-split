import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import App from '../src/components/App'
import withTests from './withTests'

storiesOf('App', module)
  .addDecorator(withTests('App'))
  .addDecorator((story, context) => withInfo('some info')(story)(context))
  .add('default', () => <App />)
