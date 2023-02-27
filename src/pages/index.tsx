import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthShowcase from "../components/authComponent";

const btn =
  "rounded border border-gray-800 bg-white py-1 px-2 font-semibold text-gray-700 hover:border-white hover:bg-gray-200 hover:text-black";
const Home: NextPage = () => {
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = api.pokemon.getPokemonById.useQuery({ id: first });
  const secondPokemon = api.pokemon.getPokemonById.useQuery({ id: second });
  const voteMutation = api.pokemon.castVote.useMutation();

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({
        votedFor: first,
        votedAgainst: second,
      });
    } else {
      voteMutation.mutate({
        votedFor: second,
        votedAgainst: first,
      });
    }
    updateIds(getOptionsForVote());
  };

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  return (
    <>
      <div className="relative flex h-screen w-screen flex-col items-center justify-center">
        <div className="text-center text-2xl ">Which pokemon looks better?</div>
        <div className="p-2" />
        <div className="flex max-w-2xl items-center justify-between rounded border p-8">
          {dataLoaded && (
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
          {!dataLoaded && (
            <Image
              alt="loading spinner"
              width="148"
              height="148"
              className="w-48"
              src="/rings.svg"
            />
          )}
        </div>
        <Link href="/results">Results</Link>
        <AuthShowcase
          signOut={() => void signOut()}
          signIn={() =>  void signIn()}
        />
      </div>
    </>
  );
};

export default Home;

const PokemonListing: React.FC<{
  pokemon: { name: string; sprites: string };
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        alt={props.pokemon.name}
        src={props.pokemon.sprites}
        height={256}
        width={256}
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
