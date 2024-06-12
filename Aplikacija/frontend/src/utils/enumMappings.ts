export function enumToString<T extends number>(
  enumValue: T,
  enumMap: { [key in T]: string }
): string {
  return enumMap[enumValue];
}

export function stringToEnum<T extends number>(
  value: string,
  enumMap: { [key in T]: string }
): T | undefined {
  const entry = Object.entries(enumMap).find(([_, v]) => v === value);
  return entry ? (Number(entry[0]) as T) : undefined;
}
