// import { text as day1Text } from './inputs/1.json' assert { type: 'json' };
import oneJson from './inputs/1.json' assert { type: 'json' };
import oneSampleJson from './inputs/1sample.json' assert { type: 'json' };
import { stringToNumber, textRowsToArray } from './inputUtils.js';

const inputArray = oneJson.text |>> textRowsToArray |> #.map(stringToNumber);
const sampleInputArray = oneSampleJson.text |>> textRowsToArray |> #.map(stringToNumber);

const calculateDepthIncreases = (depths: Array<number>) => (depths
    .reduce<[lastDepth: number, depthIncreaseCount: number]>(([lastDepth, depthIncreaseCount], depth) => [
        depth,
        depthIncreaseCount + ((depth > lastDepth) ? 1 : 0)
    ], [Number.MAX_VALUE, 0]))[1];

(`sample: Depth increased ${calculateDepthIncreases(sampleInputArray)} times`) |>> console.log;
(`input: Depth increased ${calculateDepthIncreases(inputArray)} times`) |>> console.log;

const depthSum = ([a, b, c]: [a: number, b: number, c: number]) => a + b + c;

sampleInputArray
    .map((depth, i, a) =>
        (i + 2) < a.length
            ? depthSum(a.slice(i, i + 3) as [number, number, number])
            : undefined
    )
    .filter((a): a is number => a !== undefined)
    |>> calculateDepthIncreases
    |> `averaged sample: Depth increased ${#} times` 
    |>> console.log;

inputArray
    .map((depth, i, a) =>
        (i + 2) < a.length
            ? depthSum(a.slice(i, i + 3) as [number, number, number])
            : undefined
    )
    .filter((a): a is number => a !== undefined)
    |>> calculateDepthIncreases
    |> `averaged sample: Depth increased ${#} times` 
    |>> console.log;


// console.log(sampleInputArray);
