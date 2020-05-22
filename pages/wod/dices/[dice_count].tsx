/* eslint-disable @typescript-eslint/camelcase */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import {
  LineChart,
  XAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Legend,
} from 'recharts';
import { useRouter } from 'next/router';
import { successDices, successTable } from '../../../helpers/dices';

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
  const noReRollTables = srs.map((sr) => ({
    sr,
    rolls: successTable({
      array: successDices({
        times: NUMBER_ROLLS,
        dices: dice_count,
        remove1: 0,
        reroll: false,
        success: sr,
      }),
    }),
  }));
  const reRollTables = srs.map((sr) => ({
    sr,
    rolls: successTable({
      array: successDices({
        times: NUMBER_ROLLS,
        dices: dice_count,
        remove1: 0,
        reroll: true,
        success: sr,
      }),
    }),
  }));
  const spe1Tables = srs.map((sr) => ({
    sr,
    rolls: successTable({
      array: successDices({
        times: NUMBER_ROLLS,
        dices: dice_count,
        remove1: 1,
        reroll: true,
        success: sr,
      }),
    }),
  }));
  const spe2Tables = srs.map((sr) => ({
    sr,
    rolls: successTable({
      array: successDices({
        times: NUMBER_ROLLS,
        dices: dice_count,
        remove1: 2,
        reroll: true,
        success: sr,
      }),
    }),
  }));
  const spe3Tables = srs.map((sr) => ({
    sr,
    rolls: successTable({
      array: successDices({
        times: NUMBER_ROLLS,
        dices: dice_count,
        remove1: 3,
        reroll: true,
        success: sr,
      }),
    }),
  }));

  const rollMin = {
    noReRoll: noReRollTables
      .map((e) => e.rolls.array)
      .flat()
      .reduce((min, e) => (min > e.name ? e.name : min), 0),
    reRoll: reRollTables
      .map((e) => e.rolls.array)
      .flat()
      .reduce((min, e) => (min > e.name ? e.name : min), 0),
    spe1: spe1Tables
      .map((e) => e.rolls.array)
      .flat()
      .reduce((min, e) => (min > e.name ? e.name : min), 0),
    spe2: spe2Tables
      .map((e) => e.rolls.array)
      .flat()
      .reduce((min, e) => (min > e.name ? e.name : min), 0),
    spe3: spe3Tables
      .map((e) => e.rolls.array)
      .flat()
      .reduce((min, e) => (min > e.name ? e.name : min), 0),
  };
  const rollMax = {
    noReRoll: noReRollTables
      .map((e) => e.rolls.array)
      .flat()
      .reduce((max, e) => (max < e.name ? e.name : max), 0),
    reRoll: reRollTables
      .map((e) => e.rolls.array)
      .flat()
      .reduce((max, e) => (max < e.name ? e.name : max), 0),
    spe1: spe1Tables
      .map((e) => e.rolls.array)
      .flat()
      .reduce((max, e) => (max < e.name ? e.name : max), 0),
    spe2: spe2Tables
      .map((e) => e.rolls.array)
      .flat()
      .reduce((max, e) => (max < e.name ? e.name : max), 0),
    spe3: [...spe3Tables.map((e) => e.rolls.array)]
      .flat()
      .reduce((max, e) => (max < e.name ? e.name : max), 0),
  };

  const data = {
    noReRoll: [
      ...new Array(rollMax.noReRoll + Math.abs(rollMin.noReRoll) + 1),
    ].map((_, i) => ({
      name: rollMin.noReRoll + i,
      sr4:
        Math.round(
          (noReRollTables
            .find((e) => e.sr === 4)
            ?.rolls?.map?.get(rollMin.noReRoll + i)?.val /
            NUMBER_ROLLS) *
            10000
        ) / 100 || 0,
      sr5:
        Math.round(
          (noReRollTables
            .find((e) => e.sr === 5)
            ?.rolls?.map?.get(rollMin.noReRoll + i)?.val /
            NUMBER_ROLLS) *
            10000
        ) / 100 || 0,
      sr6:
        Math.round(
          (noReRollTables
            .find((e) => e.sr === 6)
            ?.rolls?.map?.get(rollMin.noReRoll + i)?.val /
            NUMBER_ROLLS) *
            10000
        ) / 100 || 0,
      sr7:
        Math.round(
          (noReRollTables
            .find((e) => e.sr === 7)
            ?.rolls?.map?.get(rollMin.noReRoll + i)?.val /
            NUMBER_ROLLS) *
            10000
        ) / 100 || 0,
      sr8:
        Math.round(
          (noReRollTables
            .find((e) => e.sr === 8)
            ?.rolls?.map?.get(rollMin.noReRoll + i)?.val /
            NUMBER_ROLLS) *
            10000
        ) / 100 || 0,
      sr9:
        Math.round(
          (noReRollTables
            .find((e) => e.sr === 9)
            ?.rolls?.map?.get(rollMin.noReRoll + i)?.val /
            NUMBER_ROLLS) *
            10000
        ) / 100 || 0,
      sr10:
        Math.round(
          (noReRollTables
            .find((e) => e.sr === 10)
            ?.rolls?.map?.get(rollMin.noReRoll + i)?.val /
            NUMBER_ROLLS) *
            10000
        ) / 100 || 0,
      sr11:
        Math.round(
          (noReRollTables
            .find((e) => e.sr === 11)
            ?.rolls?.map?.get(rollMin.noReRoll + i)?.val /
            NUMBER_ROLLS) *
            10000
        ) / 100 || 0,
      sr12:
        Math.round(
          (noReRollTables
            .find((e) => e.sr === 12)
            ?.rolls?.map?.get(rollMin.noReRoll + i)?.val /
            NUMBER_ROLLS) *
            10000
        ) / 100 || 0,
    })),
    reRoll: [...new Array(rollMax.reRoll + Math.abs(rollMin.reRoll) + 1)].map(
      (_, i) => ({
        name: rollMin.reRoll + i,
        sr4:
          Math.round(
            (reRollTables
              .find((e) => e.sr === 4)
              ?.rolls?.map?.get(rollMin.reRoll + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr5:
          Math.round(
            (reRollTables
              .find((e) => e.sr === 5)
              ?.rolls?.map?.get(rollMin.reRoll + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr6:
          Math.round(
            (reRollTables
              .find((e) => e.sr === 6)
              ?.rolls?.map?.get(rollMin.reRoll + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr7:
          Math.round(
            (reRollTables
              .find((e) => e.sr === 7)
              ?.rolls?.map?.get(rollMin.reRoll + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr8:
          Math.round(
            (reRollTables
              .find((e) => e.sr === 8)
              ?.rolls?.map?.get(rollMin.reRoll + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr9:
          Math.round(
            (reRollTables
              .find((e) => e.sr === 9)
              ?.rolls?.map?.get(rollMin.reRoll + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr10:
          Math.round(
            (reRollTables
              .find((e) => e.sr === 10)
              ?.rolls?.map?.get(rollMin.reRoll + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr11:
          Math.round(
            (reRollTables
              .find((e) => e.sr === 11)
              ?.rolls?.map?.get(rollMin.reRoll + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr12:
          Math.round(
            (reRollTables
              .find((e) => e.sr === 12)
              ?.rolls?.map?.get(rollMin.reRoll + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
      })
    ),
    spe1: [...new Array(rollMax.spe1 + Math.abs(rollMin.spe1) + 1)].map(
      (_, i) => ({
        name: rollMin.spe1 + i,
        sr4:
          Math.round(
            (spe1Tables
              .find((e) => e.sr === 4)
              ?.rolls?.map?.get(rollMin.spe1 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr5:
          Math.round(
            (spe1Tables
              .find((e) => e.sr === 5)
              ?.rolls?.map?.get(rollMin.spe1 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr6:
          Math.round(
            (spe1Tables
              .find((e) => e.sr === 6)
              ?.rolls?.map?.get(rollMin.spe1 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr7:
          Math.round(
            (spe1Tables
              .find((e) => e.sr === 7)
              ?.rolls?.map?.get(rollMin.spe1 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr8:
          Math.round(
            (spe1Tables
              .find((e) => e.sr === 8)
              ?.rolls?.map?.get(rollMin.spe1 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr9:
          Math.round(
            (spe1Tables
              .find((e) => e.sr === 9)
              ?.rolls?.map?.get(rollMin.spe1 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr10:
          Math.round(
            (spe1Tables
              .find((e) => e.sr === 10)
              ?.rolls?.map?.get(rollMin.spe1 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr11:
          Math.round(
            (spe1Tables
              .find((e) => e.sr === 11)
              ?.rolls?.map?.get(rollMin.spe1 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr12:
          Math.round(
            (spe1Tables
              .find((e) => e.sr === 12)
              ?.rolls?.map?.get(rollMin.spe1 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
      })
    ),
    spe2: [...new Array(rollMax.spe2 + Math.abs(rollMin.spe2) + 1)].map(
      (_, i) => ({
        name: rollMin.spe2 + i,
        sr4:
          Math.round(
            (spe2Tables
              .find((e) => e.sr === 4)
              ?.rolls?.map?.get(rollMin.spe2 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr5:
          Math.round(
            (spe2Tables
              .find((e) => e.sr === 5)
              ?.rolls?.map?.get(rollMin.spe2 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr6:
          Math.round(
            (spe2Tables
              .find((e) => e.sr === 6)
              ?.rolls?.map?.get(rollMin.spe2 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr7:
          Math.round(
            (spe2Tables
              .find((e) => e.sr === 7)
              ?.rolls?.map?.get(rollMin.spe2 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr8:
          Math.round(
            (spe2Tables
              .find((e) => e.sr === 8)
              ?.rolls?.map?.get(rollMin.spe2 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr9:
          Math.round(
            (spe2Tables
              .find((e) => e.sr === 9)
              ?.rolls?.map?.get(rollMin.spe2 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr10:
          Math.round(
            (spe2Tables
              .find((e) => e.sr === 10)
              ?.rolls?.map?.get(rollMin.spe2 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr11:
          Math.round(
            (spe2Tables
              .find((e) => e.sr === 11)
              ?.rolls?.map?.get(rollMin.spe2 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr12:
          Math.round(
            (spe2Tables
              .find((e) => e.sr === 12)
              ?.rolls?.map?.get(rollMin.spe2 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
      })
    ),
    spe3: [...new Array(rollMax.spe3 + Math.abs(rollMin.spe3) + 1)].map(
      (_, i) => ({
        name: rollMin.spe3 + i,
        sr4:
          Math.round(
            (spe3Tables
              .find((e) => e.sr === 4)
              ?.rolls?.map?.get(rollMin.spe3 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr5:
          Math.round(
            (spe3Tables
              .find((e) => e.sr === 5)
              ?.rolls?.map?.get(rollMin.spe3 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr6:
          Math.round(
            (spe3Tables
              .find((e) => e.sr === 6)
              ?.rolls?.map?.get(rollMin.spe3 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr7:
          Math.round(
            (spe3Tables
              .find((e) => e.sr === 7)
              ?.rolls?.map?.get(rollMin.spe3 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr8:
          Math.round(
            (spe3Tables
              .find((e) => e.sr === 8)
              ?.rolls?.map?.get(rollMin.spe3 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr9:
          Math.round(
            (spe3Tables
              .find((e) => e.sr === 9)
              ?.rolls?.map?.get(rollMin.spe3 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr10:
          Math.round(
            (spe3Tables
              .find((e) => e.sr === 10)
              ?.rolls?.map?.get(rollMin.spe3 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr11:
          Math.round(
            (spe3Tables
              .find((e) => e.sr === 11)
              ?.rolls?.map?.get(rollMin.spe3 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
        sr12:
          Math.round(
            (spe3Tables
              .find((e) => e.sr === 12)
              ?.rolls?.map?.get(rollMin.spe3 + i)?.val /
              NUMBER_ROLLS) *
              10000
          ) / 100 || 0,
      })
    ),
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
      <LineChart
        width={700}
        height={400}
        data={data.noReRoll}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <Legend verticalAlign="top" height={36} />

        <XAxis dataKey="name" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line
          type="monotone"
          dataKey="sr4"
          // stroke="#2368ee"
          yAxisId={0}
          name="SR4"
        />
        <Line
          type="monotone"
          dataKey="sr5"
          stroke="#ff6811"
          yAxisId={0}
          name="SR5"
        />
        <Line
          type="monotone"
          dataKey="sr6"
          stroke="#ff68ee"
          yAxisId={0}
          name="SR6"
        />
        <Line
          type="monotone"
          dataKey="sr7"
          stroke="#236800"
          yAxisId={0}
          name="SR7"
        />
        <Line
          type="monotone"
          dataKey="sr8"
          stroke="#68e32e"
          yAxisId={0}
          name="SR8"
        />
        <Line
          type="monotone"
          dataKey="sr9"
          stroke="#2f68ee"
          yAxisId={0}
          name="SR9"
        />
        <Line
          type="monotone"
          dataKey="sr10"
          stroke="#682"
          yAxisId={0}
          name="SR10"
        />
        <Line
          type="monotone"
          dataKey="sr11"
          stroke="#61e"
          yAxisId={0}
          name="SR11"
        />
        <Line
          type="monotone"
          dataKey="sr12"
          stroke="#231"
          yAxisId={0}
          name="SR12"
        />
      </LineChart>
      <p>Dices: {dice_count} no reroll</p>
      <LineChart
        width={700}
        height={400}
        data={data.reRoll}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <Legend verticalAlign="top" height={36} />

        <XAxis dataKey="name" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line
          type="monotone"
          dataKey="sr4"
          // stroke="#2368ee"
          yAxisId={0}
          name="SR4"
        />
        <Line
          type="monotone"
          dataKey="sr5"
          stroke="#ff6811"
          yAxisId={0}
          name="SR5"
        />
        <Line
          type="monotone"
          dataKey="sr6"
          stroke="#ff68ee"
          yAxisId={0}
          name="SR6"
        />
        <Line
          type="monotone"
          dataKey="sr7"
          stroke="#236800"
          yAxisId={0}
          name="SR7"
        />
        <Line
          type="monotone"
          dataKey="sr8"
          stroke="#68e32e"
          yAxisId={0}
          name="SR8"
        />
        <Line
          type="monotone"
          dataKey="sr9"
          stroke="#2f68ee"
          yAxisId={0}
          name="SR9"
        />
        <Line
          type="monotone"
          dataKey="sr10"
          stroke="#682"
          yAxisId={0}
          name="SR10"
        />
        <Line
          type="monotone"
          dataKey="sr11"
          stroke="#61e"
          yAxisId={0}
          name="SR11"
        />
        <Line
          type="monotone"
          dataKey="sr12"
          stroke="#231"
          yAxisId={0}
          name="SR12"
        />
      </LineChart>
      <p>Dices: {dice_count} with reroll</p>
      <LineChart
        width={700}
        height={400}
        data={data.spe1}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <Legend verticalAlign="top" height={36} />

        <XAxis dataKey="name" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line
          type="monotone"
          dataKey="sr4"
          // stroke="#2368ee"
          yAxisId={0}
          name="SR4"
        />
        <Line
          type="monotone"
          dataKey="sr5"
          stroke="#ff6811"
          yAxisId={0}
          name="SR5"
        />
        <Line
          type="monotone"
          dataKey="sr6"
          stroke="#ff68ee"
          yAxisId={0}
          name="SR6"
        />
        <Line
          type="monotone"
          dataKey="sr7"
          stroke="#236800"
          yAxisId={0}
          name="SR7"
        />
        <Line
          type="monotone"
          dataKey="sr8"
          stroke="#68e32e"
          yAxisId={0}
          name="SR8"
        />
        <Line
          type="monotone"
          dataKey="sr9"
          stroke="#2f68ee"
          yAxisId={0}
          name="SR9"
        />
        <Line
          type="monotone"
          dataKey="sr10"
          stroke="#682"
          yAxisId={0}
          name="SR10"
        />
        <Line
          type="monotone"
          dataKey="sr11"
          stroke="#61e"
          yAxisId={0}
          name="SR11"
        />
        <Line
          type="monotone"
          dataKey="sr12"
          stroke="#231"
          yAxisId={0}
          name="SR12"
        />
      </LineChart>
      <p>Dices: {dice_count} with 1 spe</p>
      <LineChart
        width={700}
        height={400}
        data={data.spe2}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <Legend verticalAlign="top" height={36} />

        <XAxis dataKey="name" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line
          type="monotone"
          dataKey="sr4"
          // stroke="#2368ee"
          yAxisId={0}
          name="SR4"
        />
        <Line
          type="monotone"
          dataKey="sr5"
          stroke="#ff6811"
          yAxisId={0}
          name="SR5"
        />
        <Line
          type="monotone"
          dataKey="sr6"
          stroke="#ff68ee"
          yAxisId={0}
          name="SR6"
        />
        <Line
          type="monotone"
          dataKey="sr7"
          stroke="#236800"
          yAxisId={0}
          name="SR7"
        />
        <Line
          type="monotone"
          dataKey="sr8"
          stroke="#68e32e"
          yAxisId={0}
          name="SR8"
        />
        <Line
          type="monotone"
          dataKey="sr9"
          stroke="#2f68ee"
          yAxisId={0}
          name="SR9"
        />
        <Line
          type="monotone"
          dataKey="sr10"
          stroke="#682"
          yAxisId={0}
          name="SR10"
        />
        <Line
          type="monotone"
          dataKey="sr11"
          stroke="#61e"
          yAxisId={0}
          name="SR11"
        />
        <Line
          type="monotone"
          dataKey="sr12"
          stroke="#231"
          yAxisId={0}
          name="SR12"
        />
      </LineChart>
      <p>Dices: {dice_count} with 2 spe</p>
      <LineChart
        width={700}
        height={400}
        data={data.spe3}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <Legend verticalAlign="top" height={36} />

        <XAxis dataKey="name" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line
          type="monotone"
          dataKey="sr4"
          // stroke="#2368ee"
          yAxisId={0}
          name="SR4"
        />
        <Line
          type="monotone"
          dataKey="sr5"
          stroke="#ff6811"
          yAxisId={0}
          name="SR5"
        />
        <Line
          type="monotone"
          dataKey="sr6"
          stroke="#ff68ee"
          yAxisId={0}
          name="SR6"
        />
        <Line
          type="monotone"
          dataKey="sr7"
          stroke="#236800"
          yAxisId={0}
          name="SR7"
        />
        <Line
          type="monotone"
          dataKey="sr8"
          stroke="#68e32e"
          yAxisId={0}
          name="SR8"
        />
        <Line
          type="monotone"
          dataKey="sr9"
          stroke="#2f68ee"
          yAxisId={0}
          name="SR9"
        />
        <Line
          type="monotone"
          dataKey="sr10"
          stroke="#682"
          yAxisId={0}
          name="SR10"
        />
        <Line
          type="monotone"
          dataKey="sr11"
          stroke="#61e"
          yAxisId={0}
          name="SR11"
        />
        <Line
          type="monotone"
          dataKey="sr12"
          stroke="#231"
          yAxisId={0}
          name="SR12"
        />
      </LineChart>
      <p>Dices: {dice_count} with 3 spe</p>
    </div>
  );
};

export default Vampire;
