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
      .reduce((res, e) => {
        console.log({ res, e });
        return res + e;
      })
  );

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
