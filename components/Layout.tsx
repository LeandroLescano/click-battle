import React from "react";
import Head from "next/head";

type Props = {
  children: JSX.Element;
};

function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Click battle</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl"
          crossOrigin="anonymous"
        ></link>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0"
          crossOrigin="anonymous"
        ></script>
        <meta
          name="description"
          content="Online multiplayer Click battle - Challenge your friends to a 10 second click battle!"
        />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="CLICK BATTLE" />
        <meta
          property="og:image"
          content="http://pngimg.com/uploads/cursor/cursor_PNG100721.png"
        />
        <meta
          property="og:description"
          content="Online multiplayer Click battle"
        />
        <meta property="og:url" content="https://click-battle-mp.web.app/" />
        <meta property="og:site_name" content="Click battle" />
        <meta name="twitter:title" content="Click battle" />
        <meta
          name="twitter:description"
          content="Online multiplayer Click battle"
        />
        <meta
          name="twitter:image"
          content="http://pngimg.com/uploads/cursor/cursor_PNG100721.png"
        />
        <meta name="twitter:creator" content="@LeanLescano_" />
        <meta name="author" content="Lescano Leandro Nicolas" />
      </Head>
      {children}
    </>
  );
}

export default Layout;
