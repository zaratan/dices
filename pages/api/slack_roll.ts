/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { parseAndRoll } from '../../helpers/cmd';

const slackRollApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { command = '', text = '', user_id = '' } = req.body;
    console.log({ text, user_id, command });

    if (/help/.test(text)) {
      return res.status(200).json({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<@${user_id}>: Always here to help :slightly_smiling_face:. Here are the different ways you can _use_ me:`,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `/roll attribute+ability srX [spe]`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: 'Ex: /roll 3+5 sr8 spe\n=> 3 attribute + 5 ability SR 8 and I have the spec',
              },
            ],
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '/roll X[d][e][sX][r] srY',
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: 'Ex: /roll 8s2 sr8\n=> 8 dices SR 8 and removes two 1.',
              },
              {
                type: 'mrkdwn',
                text: 'Ex: /roll 8e sr7\n=> 8 dices SR 7 and rerolls 10s.',
              },
              {
                type: 'mrkdwn',
                text: 'Ex: /roll 8d sr7\n=> 8 dices SR 7 no spe no reroll.',
              },
              {
                type: 'mrkdwn',
                text: 'Ex: /roll 8r sr7\n=> 8 dices SR 7 raw: no 1 no reroll.',
              },
            ],
          },
        ],
      });
    }

    const { successString, explString } = parseAndRoll(text);

    // ok
    res.status(200).json({
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<@${user_id}>: ${successString}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: explString,
            },
          ],
        },
      ],
    });
  } catch (e) {
    // something went wrong
    res.status(500).json({ error: e.message });
  }
};

export default slackRollApi;
