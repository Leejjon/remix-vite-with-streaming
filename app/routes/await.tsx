import { defer, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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


  const response: MatchesResponse = await fetch("https://api.football-data.org/v4/competitions/2003/matches", fetchOptions).then((res) => res.json());

  const feriados: Feriado[] = await fetch(
    "https://brasilapi.com.br/api/feriados/v1/2023"
  ).then((res) => delay(5000).then(() => res.json()));

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
  const { feriados /*: promiseFeriados*/, response /*: promiseResponse*/} =
    useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
            <ul>
              {feriados.map((feriado) => (
                <li key={feriado.date}>{feriado.name}</li>
              ))}
            </ul>
            <ul>
              {response.matches.map((match) => (
                <li key={match.id}>{match.homeTeam.name} - {match.awayTeam.name}</li>
              ))}
            </ul>
    </div>
  );
}

