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
import Layout from '../components/Layout';
import { successDices, successTable } from '../helpers/dices';

const NUMBER_ROLLS = 10000;
const SR = 7;
const DICE_COUNT = 8;

export const getStaticProps: GetStaticProps = async () => {
  const rolls8DNRRS0 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: DICE_COUNT,
      remove1: 0,
      reroll: false,
      success: SR,
    }),
    fillVoids: true,
  });
  const rolls8DRRS0 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: DICE_COUNT,
      remove1: 0,
      reroll: true,
      success: SR,
    }),
    fillVoids: true,
  });
  const rolls8DRRS1 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: DICE_COUNT,
      remove1: 1,
      reroll: true,
      success: SR,
    }),
    fillVoids: true,
  });
  const rolls8DRRS2 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: DICE_COUNT,
      remove1: 2,
      reroll: true,
      success: SR,
    }),
    fillVoids: true,
  });
  const rolls8DRRS3 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: DICE_COUNT,
      remove1: 3,
      reroll: true,
      success: SR,
    }),
    fillVoids: true,
  });
  const rolls8DRRS4 = successTable({
    array: successDices({
      times: NUMBER_ROLLS,
      dices: DICE_COUNT,
      remove1: 4,
      reroll: true,
      success: SR,
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
  const data = {
    sr7: [...new Array(rollMax + Math.abs(rollMin) + 1)].map((_, i) => ({
      name: rollMin + i,
      D8NRRS0: rolls8DNRRS0.map.get(rollMin + i)?.val || 0,
      D8RRS0: rolls8DRRS0.map.get(rollMin + i)?.val || 0,
      D8RRS1: rolls8DRRS1.map.get(rollMin + i)?.val || 0,
      D8RRS2: rolls8DRRS2.map.get(rollMin + i)?.val || 0,
      D8RRS3: rolls8DRRS3.map.get(rollMin + i)?.val || 0,
      D8RRS4: rolls8DRRS4.map.get(rollMin + i)?.val || 0,
    })),
  };

  return {
    props: { data },
  };
};

function Vampire({
  data,
}: {
  data: {
    sr7: Array<{ name: number; 8: number }>;
  };
}) {
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
          data={data.sr7}
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
            name="8 dices"
          />
          <Line
            type="monotone"
            dataKey="D8RRS0"
            stroke="#ff6811"
            yAxisId={0}
            name="8 dices Reroll"
          />
          <Line
            type="monotone"
            dataKey="D8RRS1"
            stroke="#ff68ee"
            yAxisId={0}
            name="8 dices Reroll spe 1"
          />
          <Line
            type="monotone"
            dataKey="D8RRS2"
            stroke="#236800"
            yAxisId={0}
            name="8 dices Reroll spe 2"
          />
          <Line
            type="monotone"
            dataKey="D8RRS3"
            stroke="#68e32e"
            yAxisId={0}
            name="8 dices Reroll spe 3"
          />
          <Line
            type="monotone"
            dataKey="D8RRS4"
            stroke="#2f68ee"
            yAxisId={0}
            name="8 dices Reroll spe 4"
          />
        </LineChart>
      </Layout>
    </>
  );
}

export default Vampire;
