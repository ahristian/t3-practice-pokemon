import { PrismaClient } from "@prisma/client";
import { PokemonClient } from "pokenode-ts";

const doBackFill = async () => {
  const pokeApi = new PokemonClient();
  const allPokemon = await pokeApi.listPokemons(0, 493);

  const formatedPokemon = allPokemon.results.map((p, index) => ({
    id: index + 1,
    name: (p as { name: string }).name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      index + 1
    }.png`,
  }));

  const prisma = new PrismaClient();

  formatedPokemon.map(async (pokemonElement) => {
    return  await prisma.pokemon.create({
      data: pokemonElement,
    });
  });
};

doBackFill();
