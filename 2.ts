import inputJson from './inputs/2.json' assert { type: 'json' };
import sampleJson from './inputs/2sample.json' assert { type: 'json' };
import { stringToNumber, textRowsToArray } from './inputUtils.js';

type Vector = {
	x: number,
	z: number,	
};

const possibleMovements: Record<string, Vector> = {
	'forward': {
		x: 1,
		z: 0,
	},
	'down': {
		x: 0,
		z: 1,
	},
	'up': {
		x: 0,
		z: -1,
	},	
} as const;

const multiplyMovement = ({x, z}: Vector, distance: number): Vector => ({
	x: x*distance,
	z: z*distance,
});

const parseMovement = (movementString: string) =>
	movementString.split(' ')
	|> ({ dir: #[0], distance: #[1] |>> stringToNumber })
	|> multiplyMovement(possibleMovements[#.dir], #.distance);

const sumMovements = (movements: Array<ReturnType<typeof parseMovement>>) =>
	movements
		.reduce(
			(sum: Vector, part: Vector) =>
				({
					x: sum.x + part.x,
					z: sum.z + part.z,
				})
		, { x: 0, z: 0});

const funnyMultiply = (movement: Vector) =>
	movement.x * movement.z;

const calculateFunnyDistance = (input: string) =>
	input
		|>> textRowsToArray
		|> #.map(parseMovement)
		|>> sumMovements
		|>> funnyMultiply;

sampleJson.text
	|>> calculateFunnyDistance
	|> `sample funnily multiplied: ${#}`
	|>> console.log;

inputJson.text
	|>> calculateFunnyDistance
	|> `input funnily multiplied: ${#}`
	|>> console.log;
