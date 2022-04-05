/* eslint-disable camelcase */
import { useRouter } from 'next/router';
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
import { successDices, successTable } from '../../../../../helpers/dices';
import Layout from '../../../../../components/Layout';

const NUMBER_ROLLS = 10000;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const dice_count = Number(params.dice_count);
  const sr = Number(params.sr);

  if (dice_count > 20 || dice_count < 1 || sr > 15 || sr < 2) {
    return {
      props: { data: [], sr, dice_count, patreon: true },
    };
  }

  const rolls8DNRRS0 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: dice_count,
      remove1: 0,
      reroll: false,
      success: sr,
    }),
    fillVoids: true,
  });
  const rolls8DRRS0 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: dice_count,
      remove1: 0,
      reroll: true,
      success: sr,
    }),
    fillVoids: true,
  });
  const rolls8DRRS1 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: dice_count,
      remove1: 1,
      reroll: true,
      success: sr,
    }),
    fillVoids: true,
  });
  const rolls8DRRS2 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: dice_count,
      remove1: 2,
      reroll: true,
      success: sr,
    }),
    fillVoids: true,
  });
  const rolls8DRRS3 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: dice_count,
      remove1: 3,
      reroll: true,
      success: sr,
    }),
    fillVoids: true,
  });
  const rolls8DRRS4 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: dice_count,
      remove1: 4,
      reroll: true,
      success: sr,
    }),
    fillVoids: true,
  });
  const rollMin = [
    ...rolls8DRRS0.array,
    ...rolls8DNRRS0.array,
    ...rolls8DRRS1.array,
    ...rolls8DRRS2.array,
    ...rolls8DRRS3.array,
    ...rolls8DRRS4.array,
  ].reduce((min, e) => (min > e.name ? e.name : min), 0);
  const rollMax = Math.max(
    ...[
      ...rolls8DNRRS0.array,
      ...rolls8DRRS0.array,
      ...rolls8DRRS1.array,
      ...rolls8DRRS2.array,
      ...rolls8DRRS3.array,
      ...rolls8DRRS4.array,
    ].map((e) => e.name)
  );
  const data = [...new Array(rollMax + Math.abs(rollMin) + 1)].map((_, i) => ({
    name: rollMin + i,
    D8NRRS0: rolls8DNRRS0.map.get(rollMin + i)?.val || 0,
    D8RRS0: rolls8DRRS0.map.get(rollMin + i)?.val || 0,
    D8RRS1: rolls8DRRS1.map.get(rollMin + i)?.val || 0,
    D8RRS2: rolls8DRRS2.map.get(rollMin + i)?.val || 0,
    D8RRS3: rolls8DRRS3.map.get(rollMin + i)?.val || 0,
    D8RRS4: rolls8DRRS4.map.get(rollMin + i)?.val || 0,
  }));
  return {
    props: { data, dice_count, sr, patreon: false },
  };
};

function Vampire({
  data,
  dice_count,
  sr,
  patreon,
}: {
  sr: number;
  dice_count: number;
  data: Array<{ name: number; 8: number }>;
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
    <>
      <Head>
        <title>Dices - Wod</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout currentPage="WoD">
        <LineChart
          width={700}
          height={400}
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <Legend verticalAlign="top" height={36} />

          <XAxis dataKey="name" />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Line
            type="monotone"
            dataKey="D8NRRS0"
            // stroke="#2368ee"
            yAxisId={0}
            name={`${dice_count} dices`}
          />
          <Line
            type="monotone"
            dataKey="D8RRS0"
            stroke="#ff6811"
            yAxisId={0}
            name={`${dice_count} dices reroll`}
          />
          <Line
            type="monotone"
            dataKey="D8RRS1"
            stroke="#ff68ee"
            yAxisId={0}
            name={`${dice_count} dices reroll spe 1`}
          />
          <Line
            type="monotone"
            dataKey="D8RRS2"
            stroke="#236800"
            yAxisId={0}
            name={`${dice_count} dices reroll spe 2`}
          />
          <Line
            type="monotone"
            dataKey="D8RRS3"
            stroke="#68e32e"
            yAxisId={0}
            name={`${dice_count} dices reroll spe 3`}
          />
          <Line
            type="monotone"
            dataKey="D8RRS4"
            stroke="#2f68ee"
            yAxisId={0}
            name={`${dice_count} dices reroll spe 4`}
          />
        </LineChart>
        <p>SR: {sr}</p>
      </Layout>
    </>
  );
}

export default Vampire;
