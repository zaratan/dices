import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const index = () => (
  <div>
    <Head>
      <title>Dices</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <ul>
      <li>
        <Link href="/dnd5">
          <a>D&D 5</a>
        </Link>
      </li>
      <li>
        <Link href="/wod">
          <a>WoD</a>
        </Link>
      </li>
    </ul>
  </div>
);

export default index;
