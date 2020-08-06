export function cacheKeyFn<U>(ignoreForCacheKey: (keyof U)[] = []) {
  return (p: U) => {
    if (ignoreForCacheKey.length === 0) {
      return JSON.stringify(p);
    }
    return JSON.stringify(
      Object.fromEntries(
        Object.entries(p).filter(([key]) => !ignoreForCacheKey.includes(key as keyof U))
      )
    );
  };
}
