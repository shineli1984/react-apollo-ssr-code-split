import React from 'react'
import Link from 'redux-first-router-link'

export default ({ pokemon: { id, name, image } }) => (
  <Link to={{ type: 'POKEMON', payload: { id } }}>
    <div>{name}</div>
    <div>
      <img src={image} />
    </div>
  </Link>
)
