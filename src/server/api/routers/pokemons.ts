import { z } from "zod";
import { PokemonClient } from "pokenode-ts";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../db";

export const pokemonRouter = createTRPCRouter({
  getPokemonById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const api = new PokemonClient();
      const pokemon = await api.getPokemonById(input.id);

      return { name: pokemon.name, sprites: pokemon.sprites };
      // return pokemon
    }),

  getPokemonVoteById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.vote.findMany({
        where: {
          votedFor: input.id,
        },
      });
    }),

  castVote: publicProcedure
    .input(z.object({ votedFor: z.number(), votedAgainst: z.number() }))
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: input,
      });

      return voteInDb;
    }),

  getAllVotes: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.vote.findMany();
  }),

  getAllPokemons: publicProcedure.query(() => {
    const api = new PokemonClient();
    const lists = api.listPokemons();

    return lists;
  }),
});
