import "../styles/globals.css";
import Nav from "../components/nav";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Hyesech Tech Blog</title>
      </Head>
      <Nav />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
