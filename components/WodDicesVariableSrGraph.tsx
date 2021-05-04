/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import {
  LineChart,
  Legend,
  XAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from 'recharts';

const WodDicesVariableSrGraph = ({
  data,
  diceCount,
  rollType,
}: {
  data: any;
  diceCount: number;
  rollType: string;
}) => (
  <div>
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
    <p>
      Dices: {diceCount} {rollType}
    </p>
  </div>
);

export default WodDicesVariableSrGraph;
