import { NextApiRequest, NextApiResponse } from 'next';
import { successRoll } from '../../helpers/dices';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let { sr = 6, attribute = 1, ability = 1, spec = false } = req.query;
    sr = Number(sr);
    attribute = Number(attribute);
    ability = Number(ability);
    spec = Boolean(spec);
    const remove1 = spec ? Math.max(ability - 3, 0) : 0;
    const reroll10 = ability > 3;
    const roll = successRoll({
      faces: 10,
      dices: attribute + ability,
      remove1,
      reroll: reroll10,
      success: sr,
    });
    // ok
    res
      .status(200)
      .json({ roll, sr, ability, attribute, spec, remove1, reroll10 });
  } catch (e) {
    // something went wrong
    res.status(500).json({ error: e.message });
  }
};
