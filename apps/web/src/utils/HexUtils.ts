export const toHexString = (value: number) => `0x${value.toString(16)}`;

export const fromHex = (value: string) => parseInt(value, 16);
