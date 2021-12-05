import json from './inputs/5.json' assert { type: 'json' };
import { stringToNumber } from './inputUtils.js';

type Point = {
    x: number,
    y: number,
};

type VentLine = {
    a: Point,
    b: Point,
}

const rowToVentLine = (row: string): VentLine =>
    row.split(' -> ')
    |> #.map(
        coordString => coordString.split(',') |> #.map(stringToNumber)
        |> ({ x: #[0], y: #[1] })
    )
    |> ({ a: #[0], b: #[1] })

const inputToVentLines = (input: string) =>
    input.split('\n') |> #.map(rowToVentLine);

const isHorizOrVert = (ventLine: VentLine) =>
    ventLine.a.x === ventLine.b.x
    || ventLine.a.y === ventLine.b.y;

type Map<T> = {
    w: number,
    h: number,
    grid: Array<Array<T>>,
};

const getMax = (arr: Array<number>) =>
    arr.reduce((max, curr) => Math.max(max, curr), -Number.MAX_SAFE_INTEGER)

const createMap = <T>({w, h}: { w: number, h: number}, initial: T) => ({
    w, h,
    grid: Array(h).fill(0).map(() => Array(w).fill(initial))
});

const ventLineToRightDownDirection = ({ a, b }: VentLine) => ({
    a: { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) },
    b: { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) },
})

const interpolateHVLine = ({ a, b }: VentLine) =>
    (a.x !== b.x)
        ? Array(b.x - a.x + 1).fill(0).map((_, i) => ({ x: a.x + i, y: a.y }))
        : Array(b.y - a.y + 1).fill(0).map((_, i) => ({ x: a.x, y: a.y + i }));

const applyHVLineToMap = <T>(map: Map<T>, line: VentLine, applyFun: (oldVal: T, pos: Point, line: VentLine, map: Map<T>) => T) =>
    line
        |>> ventLineToRightDownDirection
        |>> interpolateHVLine
        |> #.reduce(
            (oldMap: Map<T>, { x, y }: Point) => ({
                ...oldMap,
                grid: [
                    ...oldMap.grid.slice(0, y),
                    [
                        ...oldMap.grid[y].slice(0, x),
                        applyFun(oldMap.grid[y][x], { x, y }, line, map),
                        ...oldMap.grid[y].slice(x + 1),
                    ],
                    ...oldMap.grid.slice(y + 1),
                ],
            })
            , map
        )

const incrementGridNum: Parameters<typeof applyHVLineToMap>[2] = (oldVal: number) =>
    oldVal + 1;

json.sample
    |>> inputToVentLines
    |> #.filter(isHorizOrVert)
    |> #.reduce((currentMap, ventLine) =>
        applyHVLineToMap(currentMap, ventLine, incrementGridNum)
        , createMap({
            w: #.map(line => line |>> Object.values) |> #.flat(1).map(({ x }) => x) |>> getMax |> # + 1,
            h: #.map(line => line |>> Object.values) |> #.flat(1).map(({ y }) => y) |>> getMax |> # + 1
        }, 0)
    )
    |> #.grid
    |> #.flat(2)
    |> #.filter(n => n >= 2)
    |> #.length
    |> `sample HV line intersection count: ${#}`
    |>> console.log;

json.input
    |>> inputToVentLines
    |> #.filter(isHorizOrVert)
    |> #.reduce((currentMap, ventLine) =>
        applyHVLineToMap(currentMap, ventLine, incrementGridNum)
        , createMap({
            w: #.map(line => line |>> Object.values) |> #.flat(1).map(({ x }) => x) |>> getMax |> # + 1,
            h: #.map(line => line |>> Object.values) |> #.flat(1).map(({ y }) => y) |>> getMax |> # + 1
        }, 0)
    )
    |> #.grid
    |> #.flat(2)
    |> #.filter(n => n >= 2)
    |> #.length
    |> `sample HV line intersection count: ${#}`
    |>> console.log;
