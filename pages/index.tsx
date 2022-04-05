/* eslint-disable react-hooks/rules-of-hooks */
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { classNames } from '../styles/cssClasses';
import { rollDice, successDices } from '../helpers/dices';
import { roll } from '../helpers/cmd';

const diceTypesOptions = [
  { id: 'd10', title: 'd10' },
  { id: 'd20', title: 'd20' },
];

const index = () => {
  const [diceCount, setDiceCount] = useState(1);
  const [sr, setSR] = useState(6);
  const [diceType, setDiceType] = useState('d10');

  const [resultStr, setResultStr] = useState('');

  const rollAction = () => {
    switch (diceType) {
      case 'd10':
        const rolls = roll({
          raw: false,
          dices: diceCount,
          remove1: 0,
          reroll10: false,
          sr,
          ambi: false,
        });

        setResultStr(
          `${rolls.successString} : (${rolls.rolls.roll.join(', ')})`
        );
        break;
      case 'd20':
        setResultStr(
          rollDice({
            times: diceCount,
            faces: 20,
            add: 0,
          }).join(', ')
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Head>
        <title>Dices</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout currentPage="Index">
        <div className="flex flex-col">
          <header>
            <p>
              This app is multiple tools bundled together around throwing dices
              for various Tabletop RPGs.
            </p>
          </header>
          <section className="pt-6">
            <h3 className="text-lg pb-2">Dice Launcher</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                rollAction();
              }}
            >
              <div>
                <label
                  htmlFor="diceCount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dice Count
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="diceCount"
                    id="diceCount"
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="6"
                    value={diceCount}
                    onChange={(e) => setDiceCount(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    Dice type
                  </h4>
                </div>

                <RadioGroup
                  value={diceType}
                  onChange={setDiceType}
                  className="mt-2"
                >
                  <RadioGroup.Label className="sr-only">
                    Choose a dice type
                  </RadioGroup.Label>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {diceTypesOptions.map((option) => (
                      <RadioGroup.Option
                        key={option.id}
                        value={option.id}
                        className={({ active, checked }) =>
                          classNames(
                            'cursor-pointer focus:outline-none',
                            active
                              ? 'ring-2 ring-offset-2 ring-purple-400'
                              : '',
                            checked
                              ? 'bg-purple-600 border-transparent text-white hover:bg-purple-700'
                              : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
                            'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1'
                          )
                        }
                      >
                        <RadioGroup.Label as="p">
                          {option.title}
                        </RadioGroup.Label>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              {diceType === 'd10' ? (
                <div className="pt-2">
                  <label
                    htmlFor="SR"
                    className="block text-sm font-medium text-gray-700"
                  >
                    SR
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="sr"
                      id="sr"
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="6"
                      value={sr}
                      onChange={(e) => setSR(Number(e.target.value))}
                    />
                  </div>
                </div>
              ) : null}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Roll
                </button>
              </div>
            </form>
          </section>
          <section className="pt-6">
            <h3 className="text-lg pb-2">Results</h3>
            <div className="text-sm">
              <p>{resultStr}</p>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default index;
