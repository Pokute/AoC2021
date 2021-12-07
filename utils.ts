export const sum = (a: number, b: number) => (a + b);
export const max = (a: number, b: number) => Math.max(a, b);
export const min = (a: number, b: number) => Math.min(a, b);
export const arrayLen = (length: number, initial = 0): Array<number> => Array(length).fill(initial);
export const arrayInc = (length: number) => arrayLen(length, 0).map((_, i) => i);
