export const getRandomPokemon: (
  MAX_DEX_ID: number,
  notThisOne?: number
) => number = (MAX_DEX_ID, notThisOne) => {
  const pokemonNumber = Math.floor(Math.random() * MAX_DEX_ID);

  if (pokemonNumber !== notThisOne && pokemonNumber !== 0) return pokemonNumber;
  return getRandomPokemon(MAX_DEX_ID, notThisOne);
};

export const getOptionsForVote: (MAX_DEX_ID: number) => [number, number] = (
  MAX_DEX_ID
) => {
  const firstId = getRandomPokemon(MAX_DEX_ID);
  const secondId = getRandomPokemon(MAX_DEX_ID, firstId);

  return [firstId, secondId];
};
