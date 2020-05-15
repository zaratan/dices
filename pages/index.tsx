import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const index = () => (
  <div>
    <Head>
      <title>Dices - D&D 5</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <ul>
      <li>
        <Link href="/dnd5">
          <a>D&D 5</a>
        </Link>
      </li>
    </ul>
  </div>
);

export default index;
