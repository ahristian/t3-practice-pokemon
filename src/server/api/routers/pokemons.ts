import { z } from "zod";

import { PokemonClient } from "pokenode-ts";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const pokemonRouter = createTRPCRouter({
  getPokemonById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query( async ({ input }) => {
      const api = new PokemonClient();
      const pokemon = await api.getPokemonById(input.id);
      return { name: pokemon.name, sprites: pokemon.sprites };
      // return pokemon
    }),
});
