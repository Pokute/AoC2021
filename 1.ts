// import { text as day1Text } from './inputs/1.json' assert { type: 'json' };
import oneJson from './inputs/1.json' assert { type: 'json' };
import oneSampleJson from './inputs/1sample.json' assert { type: 'json' };
import { stringToNumber, textRowsToArray } from './inputUtils.js';

const inputArray = oneJson.text |>> textRowsToArray |> #.map(stringToNumber);
const sampleInputArray = oneSampleJson.text |>> textRowsToArray |> #.map(stringToNumber);

const calculateDepthIncreases = (depths: Array<number>) => (depths
    .reduce<[number, number]>(([lastDepth, depthIncreaseCount], depth) => [
        depth,
        depthIncreaseCount + ((depth > lastDepth) ? 1 : 0)
    ], [Number.MAX_VALUE, 0]))[1];

(`sample: Depth increased ${calculateDepthIncreases(sampleInputArray)} times`) |>> console.log;
(`input: Depth increased ${calculateDepthIncreases(inputArray)} times`) |>> console.log;
