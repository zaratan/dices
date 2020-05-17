/* eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { successRoll } from '../../helpers/dices';

// https://regex101.com/r/WV6qCJ/1
const SR_REGEXP = /sr\s*(?<sr>\d+)|(?:\s|^)s\s*(?<srs>\d+)/i;
// https://regex101.com/r/zRwzzV/1
const ATTR_ABI_REGEX = /(?<bspe>s(?:pe?c?)?(?=\s*\d+\s*(?=\+)))?.*(?<attr>\d+)\s*\+\s*(?<abi>\d+)[de]?(?:(?<spec>s)|.*(?<spe>s(?:pe?c?)?)(?:$|(?!\s*[0-9r])))?/i;
// https://regex101.com/r/EA0VRJ/1
const DICES_REGEX = /(?:(?<![a-z+]\s*)|^)(?<dices>\d+)\s*d?(?<explosive>e)?(?<raw>r(?:aw)?)?(?:s(?:pe?c?)?\s*(?<spec>\d))?(?!\+)/i;

const AMBIG_REGEX = /^(?:(?:(?<!\+)\s*\d+\s+s\s*\d+\s*)|(?:s\s*\d.*\ss\s*\d))$/i;

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
                text:
                  'Ex: /roll 3+5 sr8 spe\n=> 3 attribute + 5 ability SR 8 and I have the spec',
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
                text: 'Ex: /roll 8s2 sr8\n=> 8 dice SR 8 and remove two 1.',
              },
              {
                type: 'mrkdwn',
                text: 'Ex: /roll 8e sr7\n=> 8 dice SR 7 and reroll 10s.',
              },
              {
                type: 'mrkdwn',
                text: 'Ex: /roll 8d sr7\n=> 8 dice SR 7 no spe no reroll.',
              },
              {
                type: 'mrkdwn',
                text: 'Ex: /roll 8r sr7\n=> 8 dice SR 7 raw: no 1 no reroll.',
              },
            ],
          },
        ],
      });
    }

    const attr_match = ATTR_ABI_REGEX.exec(text);
    const dices_match = DICES_REGEX.exec(text);
    const sr_match = SR_REGEXP.exec(text);
    const ambi = AMBIG_REGEX.test(text);

    let remove1 = 0;
    let reroll10 = false;
    let dices = 1;
    let raw = false;

    if (attr_match?.groups) {
      const { bspe, spe, spec } = attr_match.groups;
      const attr = Number(attr_match.groups.attr);
      const abi = Number(attr_match.groups.abi);
      dices = attr + abi;
      reroll10 = abi > 3;
      remove1 = bspe || spe || spec ? Math.max(abi - 3, 0) : 0;
    } else if (dices_match?.groups) {
      const { explosive } = dices_match.groups;
      raw = Boolean(dices_match.groups.raw);
      dices = Number(dices_match.groups.dices);
      remove1 = dices > 4 ? Number(dices_match.groups.spec || 0) : 0;
      reroll10 = dices > 3 ? !!explosive || !!dices_match.groups.spec : false;
    }
    const sr = Number(
      (sr_match?.groups &&
        (sr_match?.groups['sr'] || sr_match?.groups['srs'])) ||
        6
    );
    const roll = successRoll({
      faces: 10,
      dices,
      remove1,
      reroll: reroll10,
      success: sr,
      raw,
    });

    let successString: string;
    if (roll.success > 1) {
      successString = `${roll.success} successes`;
    } else if (roll.success === 1) {
      successString = `1 success`;
    } else if (roll.success === 0) {
      successString = `fail (0 success)`;
    } else {
      successString = `critical fail! (${Math.abs(roll.success)} fails)`;
    }

    const ambiString = ambi
      ? '\n:warning: The query was ambiguous. Please check :slightly_smiling_face:'
      : '';

    const explString = `_[${roll.roll.join(', ')}]_ (${dices} SR ${sr} ${
      raw ? 'raw' : ''
    }${
      // eslint-disable-next-line no-nested-ternary
      raw
        ? ''
        : remove1 > 0
        ? `with spec ${remove1} 1s ignored`
        : `without spec`
    })${ambiString}`;

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
