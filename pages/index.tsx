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
      <li>
        <a href="https://slack.com/oauth/v2/authorize?client_id=235853654149.1121819109926&scope=commands">
          <img
            alt="Add to Slack"
            height="40"
            width="139"
            src="https://platform.slack-edge.com/img/add_to_slack.png"
            srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
      </li>
      <li>
        <a href="https://discord.com/oauth2/authorize?client_id=454652194931736576&scope=bot">
          Add Discord bot
        </a>
      </li>
    </ul>
  </div>
);

export default index;
