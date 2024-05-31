import { defer, type MetaFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { MatchesResponse} from "~/model/Match";

const {REACT_APP_FOOTBALL_API_KEY} = process.env;

export type Feriado = {
  name: string;
  date: string;
};

export type Endereco = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
};

// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

export async function loader() {
  if (!REACT_APP_FOOTBALL_API_KEY) {
    // You can just register on api.football-data.org to generate your own free key.
    throw new Error("Please put your own key in the .env.local file as REACT_APP_FOOTBALL_API_KEY value");
  }

  const fetchOptions: RequestInit = {
    method: 'GET',
    headers: {
      'X-Auth-Token': REACT_APP_FOOTBALL_API_KEY
    }
  };

  const response: Promise<MatchesResponse> = fetch("https://api.football-data.org/v4/competitions/2003/matches", fetchOptions).then((res) => res.json());

  const feriados: Promise<Feriado[]> = fetch(
    "https://brasilapi.com.br/api/feriados/v1/2023"
  ).then((res) => res.json());

  return defer({
    feriados,
    response
  });
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const {feriados, response} =
    useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <Suspense fallback={<p>loading</p>}>
        <Await resolve={feriados}>
          {(feriados) => (
            <ul>
              {feriados.map((feriado) => (
                <li key={feriado.date}>{feriado.name}</li>
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
      <Suspense fallback={<p>Eredivisie</p>}>
        <Await resolve={response} errorElement={<p>Error</p>}>
          {(response) => (
            <ul>
              {response.matches.map((match) => (
                <li key={match.id}>{match.homeTeam.name} - {match.awayTeam.name}</li>
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

