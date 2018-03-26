import React from 'react'
import { filter } from 'graphql-anywhere'
import Item from './PokemonsListItemContainer'
import SelectPokemon from './SelectPokemonContainer'

export default ({ pokemons, fetchMore, refetch }) => (
  <div>
    {pokemons.map(pokemon => (
      <div key={pokemon.id}>
        number {pokemon.number}
        <Item pokemon={filter(Item.fragments.pokemon, pokemon)} />
        <SelectPokemon pokemonId={pokemon.id} />
      </div>
    ))}
    <button onClick={refetch}>Reload</button>
    <button onClick={fetchMore}>Load More</button>
  </div>
)
