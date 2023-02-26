import type { GetServerSideProps } from "next";
import { prisma } from "../server/db";
import { AsyncReturnType } from "../utils/ts-bs";
import Image from "next/image";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: [
      {
        votesFor: {
          _count: "desc",
        },
      },
    ],
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          votesFor: true,
          votesAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { votesFor, votesAgainst } = pokemon._count;
  if (votesFor + votesAgainst === 0) {
    return "0"
  }
  return ((votesFor / (votesAgainst + votesFor)) * 100).toString();
};

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = (
  props
) => {
  return (
    <div className="flex items-center border-b p-2 justify-between">
      <div className="flex items-center">
        <Image
          alt={props.pokemon.name}
          src={props.pokemon.spriteUrl}
          height={64}
          width={64}
        />
        <div className="capitalize pl-2">{props.pokemon.name}</div>
      </div>
      <div className="pr-4">{generateCountPercent(props.pokemon) + "%"}</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: AsyncReturnType<typeof getPokemonInOrder>;
}> = (props) => {
  return (
    <div className="flex flex-col items-center ">
      <h2 className="mb-2 text-2xl">Results</h2>
      <div className="flex w-full max-w-2xl flex-col border">
        {props.pokemon.map((currentPokemon, index) => {
          return <PokemonListing pokemon={currentPokemon} key={index} />;
        })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonoOrdered = await getPokemonInOrder();
  return {
    props: { pokemon: pokemonoOrdered },
    revalidate: 60,
  };
};
