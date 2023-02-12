import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { useMemo, useState } from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";

const btn =
  "rounded border border-gray-800 bg-white py-1 px-2 font-semibold text-gray-700 hover:border-white hover:bg-gray-200 hover:text-black";
const Home: NextPage = () => {
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = api.pokemon.getPokemonById.useQuery({ id: first });
  const secondPokemon = api.pokemon.getPokemonById.useQuery({ id: second });

  const voteForRoundest = (selected: number) => {
    console.log("voted");
    updateIds(getOptionsForVote());
  };

  return (
    <>
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="text-center text-2xl ">Which pokemon is rounder?</div>
        <div className="p-2" />
        <div className="flex max-w-2xl items-center justify-between rounded border p-8">
          {!firstPokemon.isLoading &&
            firstPokemon.data &&
            !secondPokemon.isLoading &&
            secondPokemon.data && (
              <>
                <PokemonListing
                  pokemon={firstPokemon.data}
                  vote={() => voteForRoundest(first)}
                />
                <div className="p-8">vs</div>
                <PokemonListing
                  pokemon={secondPokemon.data}
                  vote={() => voteForRoundest(second)}
                />
              </>
            )}
        </div>
        <AuthShowcase />
      </div>
    </>
  );
};

export default Home;

const PokemonListing: React.FC<{
  pokemon: { name: string; sprites: any };
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <img
        alt={props.pokemon.name}
        src={props.pokemon.sprites.front_default}
        className="h-64 w-64"
      />
      <div className="mt-[-3rem] text-center capitalize">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.router.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
