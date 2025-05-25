const NANOSECONDS_IN_1_MILLISECOND = 1_000_000;

export function getElapsedTime(start: bigint) {
  return Number(process.hrtime.bigint() - start) / NANOSECONDS_IN_1_MILLISECOND;
}
