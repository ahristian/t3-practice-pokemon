import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "../../db";

export const pokemonRouter = createTRPCRouter({
  getPokemonById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const pokemon = await prisma.pokemon.findFirst({
        where: { id: input.id },
      });
      if (!pokemon) {
        throw new Error("it doesnt exist");
      } else {
        return { name: pokemon.name, sprites: pokemon.spriteUrl };
      }
    }),

  // getPokemonVoteById: publicProcedure
  //   .input(z.object({ id: z.number() }))
  //   .query(async ({ ctx, input }) => {
  //     return await ctx.prisma.vote.findMany({
  //       where: {
  //         votedFor: input.id,
  //       },
  //     });
  //   }),

  castVote: publicProcedure
    .input(z.object({ votedFor: z.number(), votedAgainst: z.number() }))
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: {
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor,
        },
      });

      return voteInDb;
    }),

  getAllVotes: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.vote.findMany();
  }),
});
