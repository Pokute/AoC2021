import json from './inputs/6.json' assert { type: 'json' };
import { stringToNumber } from './inputUtils.js';

const inputToAges = (input: string) =>
    input.split(',')
        |> #.map(stringToNumber);

type GroupedByAge = {
    readonly [age: number]: number,
};

const groupByAges = (ages: ReadonlyArray<number>): GroupedByAge =>
    ages.reduce((ageSums, currentAge) => ({
        ...ageSums,
        [currentAge]: (ageSums[currentAge] ?? 0) + 1,
    }), {});

const ageAfterSpawning = 6;
const newlySpawnedAddedAge = 2;
const simulatedDays = 80;

const sumGroups = (...arrays: Array<GroupedByAge>) =>
    arrays.map(a => a |>> Object.entries)
        .flat(1)
        .reduce((grouped, [age, count]) =>
            ({
                ...grouped,
                [age]: (grouped[age] ?? 0) + count,
            })
            , {}
        );

const ageByDay = (groupedAges: GroupedByAge): GroupedByAge =>
    groupedAges
        |>> Object.entries
        |> #.map<[number, number]>(([age, count]) => 
            [((age |>> stringToNumber) - 1), count]
        )
        |> #.filter(([age]) => age >= 0)
        |>> Object.fromEntries;

const resetSpawnTime = (groupByAges :GroupedByAge): GroupedByAge =>
    groupByAges[0]
        |> ({ [ageAfterSpawning]: # ?? 0 });

const spawnNew = (groupByAges :GroupedByAge): GroupedByAge =>
    groupByAges[0]
        |> ({ [ageAfterSpawning + newlySpawnedAddedAge]: # ?? 0 });

json.sample
    |>> inputToAges
    |>> groupByAges
    |> Array(simulatedDays).fill(0)
        .reduce((groupedByAges) =>
            sumGroups(
                ageByDay(groupedByAges),
                resetSpawnTime(groupedByAges),
                spawnNew(groupedByAges),
            )
        , #)
    |> Object.values<number>(#)
    |> #.reduce((sum: number, curr: number) => sum + curr, 0)
    |> (`sample lanterFished after ${simulatedDays}: ${#}`)
    |>> console.log;

json.input
    |>> inputToAges
    |>> groupByAges
    |> Array(simulatedDays).fill(0)
        .reduce((groupedByAges) =>
            sumGroups(
                ageByDay(groupedByAges),
                resetSpawnTime(groupedByAges),
                spawnNew(groupedByAges),
            )
        , #)
    |>> Object.values
    |> #.reduce((sum: number, curr: number) => sum + curr, 0)
    |> (`input lanterFished after ${simulatedDays}: ${#}`)
    |>> console.log;

const simulatedDaysPart2 = 256;

json.sample
    |>> inputToAges
    |>> groupByAges
    |> Array(simulatedDaysPart2).fill(0)
        .reduce((groupedByAges) =>
            sumGroups(
                ageByDay(groupedByAges),
                resetSpawnTime(groupedByAges),
                spawnNew(groupedByAges),
            )
        , #)
    |> Object.values<number>(#)
    |> #.reduce((sum: number, curr: number) => sum + curr, 0)
    |> (`sample lanterFished after ${simulatedDaysPart2}: ${#}`)
    |>> console.log;

json.input
    |>> inputToAges
    |>> groupByAges
    |> Array(simulatedDaysPart2).fill(0)
        .reduce((groupedByAges) =>
            sumGroups(
                ageByDay(groupedByAges),
                resetSpawnTime(groupedByAges),
                spawnNew(groupedByAges),
            )
        , #)
    |>> Object.values
    |> #.reduce((sum: number, curr: number) => sum + curr, 0)
    |> (`input lanterFished after ${simulatedDaysPart2}: ${#}`)
    |>> console.log;
