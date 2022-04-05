import Head from 'next/head';
import React from 'react';
import Image from 'next/image';
import Layout from '../components/Layout';

function Bots() {
  return (
    <>
      <Head>
        <title>Dices - Bots</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout currentPage="Bots">
        <ul>
          <li>
            <a href="https://slack.com/oauth/v2/authorize?client_id=235853654149.1121819109926&scope=commands">
              <Image
                alt="Add to Slack"
                height="40"
                width="139"
                layout="fixed"
                src="https://platform.slack-edge.com/img/add_to_slack.png"
              />
            </a>
          </li>
          <li>
            <a href="https://discord.com/oauth2/authorize?client_id=454652194931736576&scope=bot">
              Add Discord bot
            </a>
          </li>
        </ul>
      </Layout>
    </>
  );
}

export default Bots;
