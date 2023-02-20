const MAX_DEX_ID = 492;

export const getRandomPokemon: (notThisOne?: number) => number = (
  notThisOne
) => {
  const pokemonNumber = Math.floor(Math.random() * MAX_DEX_ID);

  if (pokemonNumber !== notThisOne && pokemonNumber !== 0) return pokemonNumber;
  return getRandomPokemon(notThisOne);
};

export const getOptionsForVote: () => [number, number] = () => {
  const firstId = getRandomPokemon();
  const secondId = getRandomPokemon(firstId);

  return [firstId, secondId];
};
