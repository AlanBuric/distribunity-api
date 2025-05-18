export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelize(str: string): string {
  let result = "";
  let i = 0;
  let capitalizeNext = false;

  while (i < str.length) {
    const underscoreIndex = str.indexOf("_", i);

    if (underscoreIndex === -1) {
      result += capitalizeNext ? capitalize(str.slice(i)) : str.slice(i);
      break;
    }

    result += capitalizeNext
      ? capitalize(str.slice(i, underscoreIndex))
      : str.slice(i, underscoreIndex);
    capitalizeNext = true;
    i = underscoreIndex + 1;
  }

  return result;
}
