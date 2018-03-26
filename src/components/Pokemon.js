import React from 'react'

const Pokemon = ({ pokemon: { name, image, classification, types } }) => (
  <div>
    <div>{name}</div>
    <div>
      <img src={image} />
      <div>{classification}</div>
      {types.join(', ')}
    </div>
  </div>
)

export default Pokemon
