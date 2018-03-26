import React from 'react'
import { connect } from 'react-redux'
import { TransitionGroup, Transition } from 'transition-group'
import universal from 'react-universal-component'

import Loading from './Loading'
import Err from './Error'
import styles from '../css/Switcher.css'

const UniversalComponent = universal(({ page }) => import(`./${page}`), {
  minDelay: 500,
  loading: Loading,
  error: Err
})

const Switcher = ({ page, direction, location }) => (
  <TransitionGroup className={`${direction}`} duration={500} prefix="fade">
    <Transition key={page}>
      <UniversalComponent page={page} location={location} />
    </Transition>
  </TransitionGroup>
)

const mapState = ({ page, direction, location }) => ({
  page,
  direction,
  location
})

export default connect(mapState)(Switcher)
