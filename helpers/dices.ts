export const rollDice = ({ faces = 20, add = 0, times = 1 } = {}) =>
  [...new Array(times)].map(() => Math.ceil(Math.random() * faces) + add);

export const takeNDices = ({
  faces = 20,
  add = 0,
  times = 1,
  dicePerRoll = 2,
  take = 1,
  max = true,
} = {}) =>
  [...new Array(times)].map(() =>
    rollDice({ faces, add, times: dicePerRoll })
      .sort((a, b) => (max ? b - a : a - b))
      .slice(0, take)
      .reduce((res, e) => res + e)
  );

export const successRoll = ({
  dices = 1,
  faces = 10,
  success = 6,
  reroll = false,
  remove1 = 0,
  raw = false,
} = {}) => {
  let roll = rollDice({ faces, times: dices });
  // reroll until stabilization
  if (reroll) {
    const countMax = (count: number, dice: number) =>
      dice === faces ? count + 1 : count;
    let newMaxDices = roll.reduce(countMax, 0);

    while (newMaxDices !== 0) {
      const newRoll = rollDice({ faces, times: newMaxDices });
      newMaxDices = newRoll.reduce(countMax, 0);
      roll = [...roll, ...newRoll];
    }
  }
  const unmodifiedRoll = [...roll];
  // remove 1s
  if (remove1 > 0) {
    let removed1 = 0;
    roll = roll.map((dice) => {
      if (dice !== 1) return dice;
      if (removed1 >= remove1) return 1;
      removed1 += 1;
      return 0;
    });
  }

  // compute successes
  const effectiveSR = success > 9 ? 9 : success;
  const successMinus = success > 9 ? success - 9 : 0;
  if (successMinus > 0) {
    let removedSuccess = 0;
    roll = roll.map((dice) => {
      if (dice < 9) return dice;
      if (removedSuccess >= successMinus) return dice;
      removedSuccess += 1;
      return 0;
    });
  }
  return {
    roll: unmodifiedRoll,
    success: roll.reduce((count, dice) => {
      if (dice >= effectiveSR) return count + 1;
      if (dice === 1 && !raw) return count - 1;
      return count;
    }, 0),
  };
};

export const successDices = ({
  dices = 1,
  faces = 10,
  times = 1,
  success = 6,
  reroll = false,
  remove1 = 0,
} = {}) =>
  [...new Array(times)].map(() => {
    const rolls = successRoll({ dices, faces, success, remove1, reroll });
    return rolls.success;
  });

export const successTable = ({
  array,
  fillVoids,
}: {
  array: Array<number>;
  fillVoids?: boolean;
}): successTableType => {
  const minRoll = array.reduce((res, e) => (res > e ? e : res), 0);
  const maxRoll = Math.max(...array);

  const resultTable = new Map();

  if (fillVoids) {
    [...Array(maxRoll + Math.abs(minRoll))].forEach((_, i) => {
      const index = minRoll + i;

      resultTable.set(index, {
        name: index,
        val: 0,
      });
    });
  }
  const finalMap = array.reduce<Map<number, { name: number; val: number }>>(
    (res, e) => {
      res.set(
        e,
        res.get(e) !== undefined
          ? { ...res.get(e), val: res.get(e).val + 1 }
          : { name: e, val: 1 }
      );
      return res;
    },
    resultTable
  );

  return {
    array: Array.from(finalMap.values()).sort((a, b) => a.name - b.name),
    map: finalMap,
  };
};

export type successTableType = {
  array: Array<{ name: number; val: number }>;
  map: Map<number, { name: number; val: number }>;
};

export const table = ({
  array,
  fillVoids,
  max = 0,
}: {
  array: Array<number>;
  fillVoids?: boolean;
  max?: number;
}) => {
  const resultTable = fillVoids
    ? [...Array(Math.max(...[...array, max]))].map((_, i) => ({
        name: i + 1,
        val: 0,
      }))
    : [];
  return array
    .reduce<Array<{ name: number; val: number }>>((result, e) => {
      result[e - 1] =
        result[e - 1] !== undefined
          ? { ...result[e - 1], val: result[e - 1].val + 1 }
          : { name: e, val: 1 };
      return result;
    }, resultTable)
    .filter((e) => e);
};
