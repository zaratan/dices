/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { successDices, successTable } from '../../../helpers/dices';
import WodDicesVariableSrGraph from '../../../components/WodDicesVariableSrGraph';

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

  const minMaxCount = (
    {
      rollTable,
      isMin = true,
    }: {
      rollTable: Array<{ rolls: { array: Array<{ name: number }> } }>;
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
    noReRoll: minMaxCount({ rollTable: noReRollTables, isMin: true }),
    reRoll: minMaxCount({ rollTable: reRollTables, isMin: true }),
    spe1: minMaxCount({ rollTable: spe1Tables, isMin: true }),
    spe2: minMaxCount({ rollTable: spe2Tables, isMin: true }),
    spe3: minMaxCount({ rollTable: spe3Tables, isMin: true }),
  };
  const rollMax = {
    noReRoll: minMaxCount({ rollTable: noReRollTables, isMin: false }),
    reRoll: minMaxCount({ rollTable: reRollTables, isMin: false }),
    spe1: minMaxCount({ rollTable: spe1Tables, isMin: false }),
    spe2: minMaxCount({ rollTable: spe2Tables, isMin: false }),
    spe3: minMaxCount({ rollTable: spe3Tables, isMin: false }),
  };

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
      (rollTable.find((e) => e.sr === sr)?.rolls?.map?.get(rollMin[key] + i)
        ?.val /
        NUMBER_ROLLS) *
        10000
    ) / 100 || 0;
  const tableToData = ({ rollTable, key }: { key: string; rollTable: any }) =>
    [...new Array(rollMax[key] + Math.abs(rollMin[key]) + 1)].map((_, i) => {
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
    noReRoll: tableToData({ rollTable: noReRollTables, key: 'noReRoll' }),
    reRoll: tableToData({ rollTable: reRollTables, key: 'reRoll' }),
    spe1: tableToData({ rollTable: spe1Tables, key: 'spe1' }),
    spe2: tableToData({ rollTable: spe2Tables, key: 'spe2' }),
    spe3: tableToData({ rollTable: spe3Tables, key: 'spe3' }),
  };

  return {
    props: { data, dice_count, patreon: false },
  };
};

const Vampire = ({
  data,
  dice_count,
  patreon,
}: {
  dice_count: number;
  data: { noReRoll: any; reRoll: any; spe1: any; spe2: any; spe3: any };
  patreon: boolean;
}) => {
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
      <WodDicesVariableSrGraph
        data={data.noReRoll}
        diceCount={dice_count}
        rollType="no reroll"
      />
      <WodDicesVariableSrGraph
        data={data.reRoll}
        diceCount={dice_count}
        rollType="with reroll"
      />
      <WodDicesVariableSrGraph
        data={data.spe1}
        diceCount={dice_count}
        rollType="with 1 spe"
      />
      <WodDicesVariableSrGraph
        data={data.spe2}
        diceCount={dice_count}
        rollType="with 2 spe"
      />
      <WodDicesVariableSrGraph
        data={data.spe3}
        diceCount={dice_count}
        rollType="with 3 spe"
      />
    </div>
  );
};

export default Vampire;
