import { defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import pokemonJsonAsAny from "../pokemon.json";
import { Suspense } from "react";

type PokemonResponse = {id: number, name: string};
type PokemonNameAndUrl = {name: string, url: string};
type PokemonJsonType = {results: Array<PokemonNameAndUrl>};

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function loadPokemon(pokemonId: number, pokemon: PokemonNameAndUrl): Promise<PokemonResponse> {
    // This way every pokemon loads a little longer.
    await delay(pokemonId * 100);

    return {id: pokemonId, name: pokemon.name} as PokemonResponse;
}

export async function loader() {
    const pokemonJson = pokemonJsonAsAny as PokemonJsonType;
    const pokemonList = pokemonJson.results.map((value, index) => {
        return loadPokemon(++index, value);
    });

    return defer({...pokemonList});
}

export default function Pokemon() {
    const data = useLoaderData<typeof loader>();

    const suspenseList = Object.values(data).map((value, index) => {
        return (
            <Suspense key={index} fallback={<p>loading</p>}>
                <Await resolve={value} errorElement={<p>Error</p>}>
                    {(response) => (
                        <p>{response.id} - {response.name}</p>
                    )}
                </Await>
            </Suspense>
        );
    });
    
    return (
        <>
            <div>All first gen pokemon:</div>
            {suspenseList}
        </>
    );
}
