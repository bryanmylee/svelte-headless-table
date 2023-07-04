export const getDistinct = <T>(items: T[]): T[] => {
  return Array.from(getCounter(items).keys());
};

export const getDuplicates = <T>(items: T[]): T[] => {
  return Array.from(getCounter(items).entries())
    .filter(([, count]) => count !== 1)
    .map(([key]) => key);
};

export const getCounter = <T>(items: T[]): Map<T, number> => {
  const result = new Map<T, number>();
  items.forEach((item) => {
    result.set(item, (result.get(item) ?? 0) + 1);
  });
  return result;
};
