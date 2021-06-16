import { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const slackInstallApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await fetch(
      `https://slack.com/api/oauth.v2.access?code=${req.query.code}&client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&redirect_uri=${process.env.SLACK_REDIRECT_URL}`
    );

    res.writeHead(302, {
      Location: '/',
    });
    res.end();
    return {};
  } catch (e) {
    // something went wrong
    res.status(500).json({ error: e.message });
  }
};

export default slackInstallApi;
