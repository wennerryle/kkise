export type Ref<T> = { value: T };

export const ref = <T>(value: T): Ref<T> => ({ value });
