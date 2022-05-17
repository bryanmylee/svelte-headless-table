export const sum = (nums: number[]): number => nums.reduce((a, b) => a + b, 0);
export const mean = (nums: number[]): number => (nums.length === 0 ? 0 : sum(nums) / nums.length);
