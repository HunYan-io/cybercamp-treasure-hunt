export const pick = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<any, any>,
  U extends { [Key in keyof T]?: 1 }
>(
  obj: T,
  fields: U
): Pick<T, keyof U & keyof T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => key in fields)
  ) as Pick<T, keyof U & keyof T>;

export const omit = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<any, any>,
  U extends { [Key in keyof T]?: 1 }
>(
  obj: T,
  fields: U
): Omit<T, keyof U> =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !(key in fields))
  ) as Omit<T, keyof U>;
