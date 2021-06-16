import { successRoll } from './dices';

// https://regex101.com/r/WV6qCJ/1
export const SR_REGEXP = /sr\s*(?<sr>\d+)/i;

// https://regex101.com/r/J4vAbo/2
export const SUM_REGEX =
  /(?:spe?c?\s*(?<bspec>\d+).*)?(?<sum>\d+(?:\s*\+\s*\d+\s*)+\+\s*\d+)\s*d?(?<explosive>e)?(?<raw>r)?(?:s\s*(?<spe>\d+))?(?:.*spe?c?\s*(?<spec>\d+))?/i;

// https://regex101.com/r/zRwzzV/4
export const ATTR_ABI_REGEX =
  /(?<bspe>spe?c?)?(?:.*?)(?<attr>\d+)\s*\+\s*(?<abi>\d+)(?<raw>\s*r)?(?:.*(?<spe>spe?c?))?/i;

// https://regex101.com/r/EA0VRJ/7
export const DICES_REGEX =
  /(?:spe?c?\s*(?<bspec>\d+).*)?(?:\s*sr\s*\d+\s*)?(?<diceCount>\d+)\s*d?(?<explosive>e)?(?<raw>r)?(?:s\s*(?<spe>\d+))?(?:.*spe?c?\s*(?<spec>\d+))?/i;

export const parseCommand = (text: string) => {
  let remove1 = 0;
  let reroll10 = false;
  let dices = 1;
  let raw = text.includes('raw');

  const sumMatch = SUM_REGEX.exec(text);
  const attrMatch = ATTR_ABI_REGEX.exec(text);
  const dicesMatch = DICES_REGEX.exec(text);
  const srMatch = SR_REGEXP.exec(text);
  if (sumMatch?.groups) {
    const { explosive, spe, spec, bspec, sum } = sumMatch.groups;
    dices = sum
      .split(/\s*\+\s*/)
      .reduce<number>((count, num) => Number(count) + Number(num), 0);

    reroll10 = dices > 3 ? !!explosive || !!spec || !!spe || !!bspec : false;
    remove1 = dices > 4 ? Number(spe || spec || bspec || 0) : 0;
    raw = raw || Boolean(sumMatch.groups.raw);
  } else if (attrMatch?.groups) {
    const { bspe, spe, spec } = attrMatch.groups;
    const attr = Number(attrMatch.groups.attr);
    const abi = Number(attrMatch.groups.abi);
    raw = raw || Boolean(attrMatch.groups.raw);
    dices = attr + abi;
    reroll10 = abi >= 3;
    remove1 = bspe || spe || spec ? Math.max(abi - 3, 0) : 0;
  } else if (dicesMatch?.groups) {
    const { explosive, diceCount, spec, spe, bspec } = dicesMatch.groups;
    raw = raw || Boolean(dicesMatch.groups.raw);
    dices = Number(diceCount);
    remove1 = dices > 4 ? Number(spec || spe || bspec || 0) : 0;
    reroll10 = dices > 3 ? !!explosive || !!spec || !!spe || !!bspec : false;
  }
  const sr = Number(
    (srMatch?.groups && (srMatch?.groups.sr || srMatch?.groups.srs)) || 6
  );

  return {
    remove1,
    reroll10,
    dices,
    raw,
    sr,
    ambi: false,
  };
};

export const roll = ({
  remove1,
  dices,
  raw,
  reroll10,
  sr,
  ambi,
}: {
  remove1: number;
  reroll10: boolean;
  dices: number;
  raw: boolean;
  sr: number;
  ambi: boolean;
}) => {
  const rolls = successRoll({
    faces: 10,
    dices,
    remove1,
    reroll: reroll10,
    success: sr,
    raw,
  });

  let successString: string;
  if (rolls.success > 1) {
    successString = `*${rolls.success} successes*`;
  } else if (rolls.success === 1) {
    successString = `*1 success*`;
  } else if (rolls.success === 0) {
    successString = `*fail (0 success)*`;
  } else {
    successString = `*critical fail! (${Math.abs(rolls.success)} fails)*`;
  }

  const ambiString = ambi
    ? '\n:warning: The query was ambiguous. Please check :slightly_smiling_face:'
    : '';

  const explString = `_[${rolls.roll.join(', ')}]_ (${dices} dice${
    dices > 1 ? 's' : ''
  } SR ${sr} ${raw ? 'raw' : ''}${
    // eslint-disable-next-line no-nested-ternary
    raw
      ? ''
      : remove1 > 0
      ? `with spec => ${remove1} 1s ignored`
      : `without spec`
  })${ambiString}`;

  return {
    ambiString,
    successString,
    explString,
    rolls,
  };
};

export const parseAndRoll = (text: string) => roll(parseCommand(text));
