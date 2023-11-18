export const toHexString = (value: number) => {
  return `0x${value.toString(16)}`;
};

export const fromHex = (value: string) => {
  return parseInt(value, 16);
};
