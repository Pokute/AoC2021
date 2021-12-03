import json from './inputs/3.json' assert { type: 'json' };
import { textRowsToArray } from './inputUtils.js';

const parseInput = (input: typeof json.input) =>
	input
		|>> textRowsToArray
		|> #.map(row =>
			row.split("")
		);

const countIndexedCharacterCounts = (arraysOfRows: ReturnType<typeof parseInput>) =>
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
		|> #.sort(([charA, countA], [charB, countB]) =>
			(countB - countA !== 0)
				? countB - countA
				: Number(charB) - Number(charA) // If count is even, prioritise bigger numbers.
		);

const selectNthOfSubArray = <T>(array: Array<Array<T>>, nth: number) =>
	array.map(subArray => subArray[nth]);

const getPowerConsumption = ({ gammaRate, epsilonRate }: { gammaRate: number, epsilonRate: number }) =>
	gammaRate * epsilonRate;

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
	|>> parseInput
	|>> countIndexedCharacterCounts
	|> #.map(sortByCharacterCounts)
	|>> selectRates
	|>> getPowerConsumption
	|> `sample power consumption: ${#}`
	|>> console.log;

json.input
	|>> parseInput
	|>> countIndexedCharacterCounts
	|> #.map(sortByCharacterCounts)
	|>> selectRates
	|>> getPowerConsumption
	|> `input power consumption: ${#}`
	|>> console.log;

const reduceByIndex = (selectedRank: number) => (input: Array<Array<string>>) =>
	input
		|> Array(#[0].length).fill(undefined)
			.reduce<ReturnType<typeof parseInput>>(
			(keptRows, _, index) =>
				(keptRows.length <= 1)
					? keptRows
					: ({
						keptRows,
						currentIndexCharacterCounts: keptRows.map(row => [row[index]])
							|>> countIndexedCharacterCounts
							|> #[0]
							|>> sortByCharacterCounts
					})
						|> #.keptRows.filter(row =>
							row[index] === (#.currentIndexCharacterCounts[selectedRank][0])
						)
			, #
		);

const ratingToDecimal = (ratingRaw: Array<string>) =>
	ratingRaw
		|> #.join('')
		|> Number.parseInt(#, 2);

const calculateLifeSupportRating = (input: Array<Array<string>>) =>
	input
		|> ({
			oxygenGeneratorRating: reduceByIndex(0)(#)[0]
				|>> ratingToDecimal,
			co2ScrubberRating: reduceByIndex(1)(#)[0]
				|>> ratingToDecimal,
		})
		|> #.oxygenGeneratorRating * #.co2ScrubberRating;

json.sample
	|>> parseInput
	|>> calculateLifeSupportRating
	|> `sample life support rating: ${#}`
	|>> console.log;

json.input
	|>> parseInput
	|>> calculateLifeSupportRating
	|> `input life support rating: ${#}`
	|>> console.log;
