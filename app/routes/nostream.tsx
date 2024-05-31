
import {json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";

export async function loader() {
    return json("Hallo");
}

export default function Index() {
    const hallo = useLoaderData<typeof loader>();

    return (<div>{hallo}</div>);
}
