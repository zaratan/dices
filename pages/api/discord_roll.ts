import { NextApiRequest, NextApiResponse } from 'next';
import { parseAndRoll } from '../../helpers/cmd';

const discordRollApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const { text = '', user = '' } = req.body;

  const { successString, explString } = parseAndRoll(text);

  res.status(200).json({
    response: `${user}: ${successString}`,
    explain: explString,
  });
};

export default discordRollApi;
