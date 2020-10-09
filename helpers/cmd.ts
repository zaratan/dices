import { successRoll } from './dices';

// https://regex101.com/r/WV6qCJ/1
export const SR_REGEXP = /sr\s*(?<sr>\d+)|(?:\s|^)s\s*(?<srs>\d+)/i;
// https://regex101.com/r/zRwzzV/1
export const ATTR_ABI_REGEX = /(?<bspe>s(?:pe?c?)?(?=\s*\d+\s*(?=\+)))?.*(?<attr>\d+)\s*\+\s*(?<abi>\d+)[de]?(?:(?<spec>s)|.*(?<spe>s(?:pe?c?)?)(?:$|(?!\s*[0-9r])))?/i;
// https://regex101.com/r/EA0VRJ/1
export const DICES_REGEX = /(?:(?<![a-z+]\s*)|^)(?<dices>\d+)\s*d?(?<explosive>e)?(?<raw>r(?:aw)?)?(?:s(?:pe?c?)?\s*(?<spec>\d))?(?!\+)/i;

export const AMBIG_REGEX = /^(?:(?:(?<!\+)\s*\d+\s+s\s*\d+\s*)|(?:s\s*\d.*\ss\s*\d))$/i;

export const parseCommand = (text: string) => {
  let remove1 = 0;
  let reroll10 = false;
  let dices = 1;
  let raw = false;

  const attrMatch = ATTR_ABI_REGEX.exec(text);
  const dicesMatch = DICES_REGEX.exec(text);
  const srMatch = SR_REGEXP.exec(text);
  const ambi = AMBIG_REGEX.test(text);

  if (attrMatch?.groups) {
    const { bspe, spe, spec } = attrMatch.groups;
    const attr = Number(attrMatch.groups.attr);
    const abi = Number(attrMatch.groups.abi);
    dices = attr + abi;
    reroll10 = abi >= 3;
    remove1 = bspe || spe || spec ? Math.max(abi - 3, 0) : 0;
  } else if (dicesMatch?.groups) {
    const { explosive } = dicesMatch.groups;
    raw = Boolean(dicesMatch.groups.raw);
    dices = Number(dicesMatch.groups.dices);
    remove1 = dices > 4 ? Number(dicesMatch.groups.spec || 0) : 0;
    reroll10 = dices > 3 ? !!explosive || !!dicesMatch.groups.spec : false;
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
    ambi,
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
