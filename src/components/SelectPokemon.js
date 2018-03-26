import React from 'react'

export default ({ onSelect, selected }) => (
  <input checked={selected} type="checkbox" onChange={onSelect} />
)
