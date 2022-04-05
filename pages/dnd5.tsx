import Head from 'next/head';
import {
  LineChart,
  XAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Legend,
} from 'recharts';
import { GetStaticProps } from 'next';
import { takeNDices, table, rollDice } from '../helpers/dices';
import Layout from '../components/Layout';

const NUMBER_ROLLS = 100000;

export const getStaticProps: GetStaticProps = async () => {
  const arrayAdvantage = takeNDices({
    times: NUMBER_ROLLS,
    dicePerRoll: 2,
    faces: 20,
    take: 1,
  });
  const arrayNormal = rollDice({ times: NUMBER_ROLLS });
  const arrayDisadvantage = takeNDices({
    times: NUMBER_ROLLS,
    dicePerRoll: 2,
    faces: 20,
    take: 1,
    max: false,
  });

  const normalData = table({ array: arrayNormal, fillVoids: true });
  const advantageData = table({ array: arrayAdvantage, fillVoids: true });
  const disadvantageData = table({ array: arrayDisadvantage, fillVoids: true });

  const data = advantageData.map((e, i) => ({
    x: e.name,
    advantage: Math.round((e.val / NUMBER_ROLLS) * 10000) / 100,
    normal: Math.round((normalData[i].val / NUMBER_ROLLS) * 10000) / 100,
    disadvantage:
      Math.round((disadvantageData[i].val / NUMBER_ROLLS) * 10000) / 100,
    name: e.name,
  }));

  data.map((e) => ({
    ...e,
    advantage: e.advantage < 0.01 ? 0 : e.advantage,
    normal: e.normal < 0.01 ? 0 : e.normal,
    disadvantage: e.disadvantage < 0.001 ? 0 : e.disadvantage,
  }));

  return {
    props: { data },
  };
};

function Home({
  data,
}: {
  data: Array<{
    x: number;
    disadvantage: number;
    advantage: number;
    normal: number;
    name: string;
  }>;
}) {
  return (
    <>
      <Head>
        <title>Dices - D&D 5</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout currentPage="DnD">
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
            dataKey="advantage"
            stroke="#ff7300"
            yAxisId={0}
            name="Advantage"
          />
          <Line
            type="monotone"
            dataKey="normal"
            stroke="#66dd12"
            yAxisId={0}
            name="Normal"
          />
          <Line
            type="monotone"
            dataKey="disadvantage"
            stroke="#2368ee"
            yAxisId={0}
            name="Disadvantage"
          />
        </LineChart>
      </Layout>
    </>
  );
}

export default Home;
