
import { NextApiRequest, NextApiResponse } from 'next';
import { parseAndRoll } from '../../helpers/cmd';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { text = '', user = '' } = req.body;
  
  const {successString, explString} = parseAndRoll(text);

  res.status(200).json({
    response: `${user}: ${successString}`,
    explain: explString
  })
}