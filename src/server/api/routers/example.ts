import { z } from "zod";

import { PokemonClient } from "pokenode-ts";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getPokemonById: publicProcedure
    .input(z.object({ id: z.number()}))
    .query(({ input }) => {
      const api = new PokemonClient();
      const pokemon = api.getPokemonById(input.id);
      return pokemon;
    }),
});
