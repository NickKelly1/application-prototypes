export class Error {
  public _tag = 'error' as const;
  public error: string;

  public constructor(error: string) {
    this.error = error;
  }
}

export class Valid<T> {
  public _tag = 'valid' as const;
  public value: T;

  public constructor(value: T) {
    this.value = value;
  }
}

export type Validator<T> = Error | Valid<T>;

export type ValidatorValue<ValidatorType> = ValidatorType extends Valid<infer T> ? T : never;

// export const
