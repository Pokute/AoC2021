import json from './inputs/3.json' assert { type: 'json' };
import { textRowsToArray } from './inputUtils.js';

const countIndexedCharacterCounts = (arraysOfRows: Array<Array<string>>) =>
	arraysOfRows.reduce<Array<Record<string, number>>> (
		(byIndexCharacterCounts, current) =>
			current.map(
				(char, i) => ({
					...byIndexCharacterCounts[i] ?? {},
					[char]: (byIndexCharacterCounts[i]?.[char] ?? 0) + 1
				})
			)
		, []
	);

const sortByCharacterCounts = (characterCounts: Record<string, number>) =>
	characterCounts
		|>> Object.entries
		|> #.sort(([, countA], [, countB]) => countB - countA);

const selectNthOfSubArray = <T>(array: Array<Array<T>>, nth: number) =>
	array.map(subArray => subArray[nth]);

const getPowerConsumption = ({ gammaRate, epsilonRate }: { gammaRate: number, epsilonRate: number }) =>
	gammaRate * epsilonRate;

const formatInput = (input: typeof json.input) =>
	input
		|>> textRowsToArray
		|> #.map(row =>
			row.split("")
		);

const selectCharacterFromCharCountTuple = ([character, count]: [string, number]) =>
	character;

const selectRates = (indexedCharaterRates: Array<Array<[string, number]>>) =>
	indexedCharaterRates |>
		({
			gammaRate: selectNthOfSubArray(#, 0)
				|> #.map(selectCharacterFromCharCountTuple)
				|> #.join('')
				|> Number.parseInt(#, 2),
			epsilonRate:  selectNthOfSubArray(#, 1)
			|> #.map(selectCharacterFromCharCountTuple)
			|> #.join('')
			|> Number.parseInt(#, 2),
		})

json.sample
	|>> formatInput
	|>> countIndexedCharacterCounts
	|> #.map(sortByCharacterCounts)
	|>> selectRates
	|>> getPowerConsumption
	|> `sample power consumption: ${#}`
	|>> console.log;

json.input
	|>> formatInput
	|>> countIndexedCharacterCounts
	|> #.map(sortByCharacterCounts)
	|>> selectRates
	|>> getPowerConsumption
	|> `input power consumption: ${#}`
	|>> console.log;
