import json from './inputs/7.json' assert { type: 'json' };
import { stringToNumber } from './inputUtils.js';
import { arrayInc, max, sum } from './utils.js';

const inputToNumbers = (input: string) =>
    input.split(',')
        |> #.map(stringToNumber);

const difference = (a: number, b: number) => Math.abs(a - b);
const sumOfNumbersUpTo = (n: number) => (n * (n + 1) / 2);

json.sample
    |>> inputToNumbers
    |> arrayInc(#.reduce(max, -Number.MAX_VALUE))
        .map(
            target => #.map(n => difference(n, target))
                .reduce(sum, 0)
                |> ({ target, distanceSum: # })
        )
    |> #.sort((a, b) => a.distanceSum - b.distanceSum)
    |> #[0]
    |> `sample target with smallest sum of distances ${#.target} with sum of distances of ${#.distanceSum}`
    |>> console.log;


json.input
    |>> inputToNumbers
    |> arrayInc(#.reduce(max, -Number.MAX_VALUE))
        .map(
            target => #.map(n => difference(n, target))
                .reduce(sum, 0)
                |> ({ target, distanceSum: # })
        )
    |> #.sort((a, b) => a.distanceSum - b.distanceSum)
    |> #[0]
    |> `input target with smallest sum of distances ${#.target} with sum of distances of ${#.distanceSum}`
    |>> console.log;

json.sample
    |>> inputToNumbers
    |> arrayInc(#.reduce(max, -Number.MAX_VALUE))
        .map(
            target => #.map(n => difference(n, target) |>> sumOfNumbersUpTo)
                .reduce(sum, 0)
                |> ({ target, distanceSum: # })
        )
    |> #.sort((a, b) => a.distanceSum - b.distanceSum)
    |> #[0]
    |> `sample target with smallest sum of growing distances ${#.target} with sum of distances of ${#.distanceSum}`
    |>> console.log;


json.input
    |>> inputToNumbers
    |> arrayInc(#.reduce(max, -Number.MAX_VALUE))
        .map(
            target => #.map(n => difference(n, target) |>> sumOfNumbersUpTo)
                .reduce(sum, 0)
                |> ({ target, distanceSum: # })
        )
    |> #.sort((a, b) => a.distanceSum - b.distanceSum)
    |> #[0]
    |> `input target with smallest sum of growing distances ${#.target} with sum of distances of ${#.distanceSum}`
    |>> console.log;
