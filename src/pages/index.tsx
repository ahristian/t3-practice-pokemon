import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { useMemo, useState } from "react";

const Home: NextPage = () => {
  const hello = api.router.hello.useQuery({ text: "from tRPC" });
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = api.router.getPokemonById.useQuery({ id: first });
  const secondPokemon = api.router.getPokemonById.useQuery({ id: second });
  console.log("firstPokemon", firstPokemon.data);
  console.log("secondPokemon", secondPokemon.data);
  console.log("second", second);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;
  return (
    <>
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="text-center text-2xl ">Which pokemon is rounder?</div>
        <div className="p-2" />
        <div className="flex max-w-2xl items-center justify-between rounded border p-8">
          <div className="h-64 w-64 flex flex-col">
            <img
              alt={firstPokemon.data?.name}
              src={firstPokemon.data?.sprites.front_default}
              className="w-full"
            />
            <div className='capitalize text-center mt-[-2rem]'>
              {firstPokemon.data?.name}
            </div>
          </div>
          <div className="p-8">vs</div>
          <div className="h-64 w-64 flex flex-col">
            <img
              alt={secondPokemon.data?.name}
              src={secondPokemon.data?.sprites.front_default}
              className="w-full"
            />
            <div className='capitalize text-center mt-[-2rem]'>
              {secondPokemon.data?.name}
            </div>
          </div>
        </div>
        <AuthShowcase />
      </div>
    </>
  );
};

export default Home;

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
