console.log('hello world');

class Employee {
  public name: string;
  // public password: string;
  // public previousPasswords: string[];
  // public creditCards: number[];
  public email: string;

  public constructor(name: string, previousPasswords: string[], password: string, creditCards: number[], email: string) {
    this.name = name;
    // this.previousPasswords = previousPasswords;
    // this.password = password;
    // this.creditCards = creditCards;
    this.email = email;
  }
}

const data = {};

// function isString(value, ): {
//   //
// }

// const validatingObject = <T>(input: unknown, sanitizedResult: T, errors: string[]) => {
//   return {
//     isString: () => validatingObject(input);
//   }
// }

// const validateEmployee = <TInput>(
//   input: TInput,
// ): { isValid: true; validatedData: {}; errors: null } | { isValid: false; validatedData: null; errors: string[] } {
//   // sanitize fresh data required for employee one by one on a new object
//   const sanitizedResult = {};
//   const errors: string[] = [];

//   if (
//     validate(input, sanitizedResult, errors)
//       .isString(input.name, 'input name is not a string')
//       .isString(input.email, 'input email is not a string')
//   ) {
//   }

//   return { isValid: true, validatedData: {}, errors: null };
// }

// const result = validateEmployee(data);

// if (result.isValid) {
//   result.validatedData;
// } else {
//   result.validatedData;
// }

// function isString<TInput, TRunningResult>(
//   input: TInput,
//   runningResult: TRunningResult,
// ): typeof validators & {
//   chain: { input: TInput; runningResult: TRunningResult } & ({ success: false } | { success: true; runningResult: string });
// } {
//   return { ...validators, chain: { input, runningResult, success: false } };
// }

type ChainableResult<TInput, TRunningOutput, TAddToOutput> =
  | {
      input: TInput;
      runningOutput: TRunningOutput;
      success: false;
    }
  | {
      input: TInput;
      runningOutput: TRunningOutput & TAddToOutput;
      success: true;
    };

interface ValidatorFunctions {
  hasString: <TInput, TRunningOutput, TAddToOutput>(
    input: TInput,
    runningOutput: TRunningOutput,
  ) => ChainableResult<TInput, TRunningOutput, TAddToOutput>;
}

class ChainValidator<TInput, TRunningOutput, TPreviousAddToOutput> {
  private currentChain: ChainableResult<TInput, TRunningOutput, TPreviousAddToOutput>;

  public constructor(chainableInput: ChainableResult<TInput, TRunningOutput, TPreviousAddToOutput>) {
    this.currentChain = chainableInput;
  }

  public hasString = (): ChainValidator<
    TInput,
    ChainableResult<TInput, TRunningOutput, TPreviousAddToOutput>,
    { thisIsTheNextString: string }
  > => {
    const { currentChain } = this;
    return new ChainValidator({
      input: currentChain.input,
      runningOutput: { ...currentChain.runningOutput, thisIsTheNextString: 'hi :)' },
      success: true,
    });
  };
}
