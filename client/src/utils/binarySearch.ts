export const binarySearch = (
  arr: number[],
  target: number,
  criteria: (mid: number, target: number) => boolean
): number | null => {
  let start = 0;
  let end = arr.length - 1;
  let closest = null;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    if (criteria(mid, target)) {
      closest = mid;
      break; // Found a beat within tolerance, exit loop
    } else if (arr[mid] < target) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return closest;
};
