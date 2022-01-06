/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  successDices,
  successTable,
  successTableType,
} from '../../../../helpers/dices';
import WodDicesVariableSrGraph from '../../../../components/WodDicesVariableSrGraph';

const NUMBER_ROLLS = 10000;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const dice_count = Number(params.dice_count);

  if (dice_count > 20 || dice_count < 1) {
    return {
      props: { data: {}, dice_count, patreon: true },
    };
  }

  const srs = [4, 5, 6, 7, 8, 9, 10, 11, 12];
  const generateRollTable = ({ remove1 = 0, reroll = false } = {}) =>
    srs.map((sr) => ({
      sr,
      rolls: successTable({
        array: successDices({
          times: NUMBER_ROLLS,
          dices: dice_count,
          remove1,
          reroll,
          success: sr,
        }),
      }),
    }));
  const noReRollTables = generateRollTable({ remove1: 0, reroll: false });
  const reRollTables = generateRollTable({ remove1: 0, reroll: true });
  const spe1Tables = generateRollTable({ remove1: 1, reroll: true });
  const spe2Tables = generateRollTable({ remove1: 2, reroll: true });
  const spe3Tables = generateRollTable({ remove1: 3, reroll: true });

  type srSuccessTablesType = Array<{ sr: number; rolls: successTableType }>;

  const minMaxCount = (
    {
      rollTable,
      isMin = true,
    }: {
      rollTable: srSuccessTablesType;
      isMin: boolean;
    } = { isMin: true, rollTable: [] }
  ) =>
    rollTable
      .map((e) => e.rolls.array)
      .flat()
      .reduce(
        (res, e) =>
          (isMin && res > e.name) || (!isMin && res < e.name) ? e.name : res,
        0
      );
  const rollMin = {
    noReRoll: 1,
    reRoll: 1,
    spe1: 1,
    spe2: 1,
    spe3: 1,
  };
  const rollMax = {
    noReRoll: minMaxCount({ rollTable: noReRollTables, isMin: false }),
    reRoll: minMaxCount({ rollTable: reRollTables, isMin: false }),
    spe1: minMaxCount({ rollTable: spe1Tables, isMin: false }),
    spe2: minMaxCount({ rollTable: spe2Tables, isMin: false }),
    spe3: minMaxCount({ rollTable: spe3Tables, isMin: false }),
  };

  const summarizeRolls = ({
    rollTables,
  }: {
    rollTables: srSuccessTablesType;
  }): srSuccessTablesType =>
    rollTables.map(({ rolls, sr }) => {
      const computedArray = rolls.array.reduce<
        Array<{ val: number; name: number }>
      >((result, roll) => {
        if (roll.name < 0) {
          if (result.find((e) => e.name === 0)) {
            result.forEach((res) => {
              if (res.name === 0) res.val += roll.val;
            });
          } else {
            result.push({ name: 0, val: roll.val });
          }
          const currentBotches = result.find((e) => e.name === -1);
          if (currentBotches) {
            return result.map((res) =>
              res.name === -1 ? { name: -1, val: res.val + roll.val } : res
            );
          }
          result.push({ val: roll.val, name: -1 });
        }
        if (roll.name === 0) {
          if (result.find((e) => e.name === 0)) {
            result.forEach((res) => {
              if (res.name === 0) res.val += roll.val;
            });
          } else {
            result.push({ name: 0, val: roll.val });
          }
        }
        if (roll.name > 0) {
          for (let i = 1; i <= roll.name; i += 1) {
            if (result.find((e) => e.name === i)) {
              result.forEach((res) => {
                if (res.name === i) res.val += roll.val;
              });
            } else {
              result.push({ name: i, val: roll.val });
            }
          }
        }
        return result;
      }, []);
      const computedMap = computedArray.reduce<
        Map<number, { name: number; val: number }>
      >((result, roll) => {
        result.set(roll.name, roll);
        return result;
      }, new Map());
      return {
        sr,
        rolls: {
          array: computedArray,
          map: computedMap,
        },
      };
    });

  const noReRollSumTables = summarizeRolls({ rollTables: noReRollTables });
  const reRollSumTables = summarizeRolls({ rollTables: reRollTables });
  const spe1SumTables = summarizeRolls({ rollTables: spe1Tables });
  const spe2SumTables = summarizeRolls({ rollTables: spe2Tables });
  const spe3SumTables = summarizeRolls({ rollTables: spe3Tables });

  const tableToSrData = ({
    rollTable,
    key,
    i,
    sr,
  }: {
    rollTable: Array<{
      sr: number;
      rolls: { map: Map<number, { val: number }> };
    }>;
    key: string;
    i: number;
    sr: number;
  }) =>
    Math.round(
      ((rollTable.find((e) => e.sr === sr)?.rolls?.map?.get(rollMin[key] + i)
        ?.val || 0) /
        NUMBER_ROLLS) *
        10000
    ) / 100 || 0;
  const tableToData = ({ rollTable, key }: { key: string; rollTable: any }) =>
    [...new Array(rollMax[key])].map((_, i) => {
      const res = {
        name: rollMin[key] + i,
      };
      srs.forEach((sr) => {
        res[`sr${sr}`] = tableToSrData({
          rollTable,
          i,
          key,
          sr,
        });
      });

      return res;
    });
  const data = {
    noReRoll: tableToData({ rollTable: noReRollSumTables, key: 'noReRoll' }),
    reRoll: tableToData({ rollTable: reRollSumTables, key: 'reRoll' }),
    spe1: tableToData({ rollTable: spe1SumTables, key: 'spe1' }),
    spe2: tableToData({ rollTable: spe2SumTables, key: 'spe2' }),
    spe3: tableToData({ rollTable: spe3SumTables, key: 'spe3' }),
  };
  const tableToSuccessRates = (sumTables: srSuccessTablesType) =>
    sumTables.reduce<
      Array<{ botches: number; fails: number; successes: number }>
    >((result, sumTable) => {
      result[sumTable.sr] = {
        botches:
          Math.round(
            ((sumTable.rolls.map.get(-1)?.val || 0) / NUMBER_ROLLS) * 10000
          ) / 100 || 0,
        fails:
          Math.round(
            ((sumTable.rolls.map.get(0)?.val || 0) / NUMBER_ROLLS) * 10000
          ) / 100 || 0,
        successes:
          Math.round(
            ((sumTable.rolls.map.get(1)?.val || 0) / NUMBER_ROLLS) * 10000
          ) / 100 || 0,
      };
      return result;
    }, []);
  const successRates = {
    noReRoll: tableToSuccessRates(noReRollSumTables),
    reRoll: tableToSuccessRates(reRollSumTables),
    spe1: tableToSuccessRates(spe1SumTables),
    spe2: tableToSuccessRates(spe2SumTables),
    spe3: tableToSuccessRates(spe3SumTables),
  };

  return {
    props: { srs, successRates, data, dice_count, patreon: false },
  };
};

function ResultSection({
  title,
  srs,
  diceCount,
  data,
  successRates,
}: {
  title: string;
  srs: Array<number>;
  diceCount: number;
  data: any;
  successRates: Array<{ botches: number; fails: number; successes: number }>;
}) {
  return (
    <section>
      <header>
        <h1>
          Dices: {diceCount} {title}
        </h1>
      </header>
      <ul>
        {srs.map((sr) => (
          <li key={`${title}${sr}`}>
            SR {sr}: Botch: {successRates[sr].botches}%, Fail:{' '}
            {successRates[sr].fails}%, Success: {successRates[sr].successes}%
          </li>
        ))}
      </ul>
      <WodDicesVariableSrGraph
        data={data}
        diceCount={diceCount}
        rollType={`${title} at least n successes`}
      />
    </section>
  );
}

function Vampire({
  data,
  srs,
  successRates,
  dice_count,
  patreon,
}: {
  dice_count: number;
  srs: Array<number>;
  successRates: {
    noReRoll: Array<{ botches: number; fails: number; successes: number }>;
    reRoll: Array<{ botches: number; fails: number; successes: number }>;
    spe1: Array<{ botches: number; fails: number; successes: number }>;
    spe2: Array<{ botches: number; fails: number; successes: number }>;
    spe3: Array<{ botches: number; fails: number; successes: number }>;
  };
  data: { noReRoll: any; reRoll: any; spe1: any; spe2: any; spe3: any };
  patreon: boolean;
}) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  if (patreon) {
    return (
      <div>
        Really? If you want this done, please consider my{' '}
        <a href="https://www.patreon.com/zaratan">Patreon</a>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Dices - Wod - Dices: {dice_count}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ResultSection
        data={data.noReRoll}
        diceCount={dice_count}
        srs={srs}
        title="no reroll"
        successRates={successRates.noReRoll}
      />
      <ResultSection
        data={data.reRoll}
        diceCount={dice_count}
        srs={srs}
        title="with reroll"
        successRates={successRates.reRoll}
      />
      <ResultSection
        data={data.spe1}
        diceCount={dice_count}
        srs={srs}
        title="with spe 1"
        successRates={successRates.spe1}
      />
      <ResultSection
        data={data.spe2}
        diceCount={dice_count}
        srs={srs}
        title="with spe 2"
        successRates={successRates.spe2}
      />
      <ResultSection
        data={data.spe3}
        diceCount={dice_count}
        srs={srs}
        title="with spe 3"
        successRates={successRates.spe3}
      />
    </div>
  );
}

export default Vampire;
