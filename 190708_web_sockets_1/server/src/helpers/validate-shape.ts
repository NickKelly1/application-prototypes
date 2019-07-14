class ValidateString {
  private typeIs = 'string';
}

class ValidateNumber {
  private typeIs = 'number';
}

class ValidateBoolean {
  private typeIs = 'boolean';
}

// class ValidateArrayOf {
//   //
// }

// class ValidateTupleMatching {
//   //
// }

class ValidateShape<T extends Record<string, AValidator>> {
  private shape: T;

  public constructor(shape: T) {
    this.shape = shape;
  }
}

type AValidator<T> = ValidateString | ValidateNumber | ValidateBoolean | ValidateShape<T>;

type Mapper<T> = T extends ValidateString
  ? string
  : T extends ValidateNumber
  ? number
  : T extends ValidateBoolean
  ? boolean
  : never;

const validateIs = <S extends AValidator>(input: any, shape: S): input is Mapper<S> => {
  if (shape instanceof ValidateString) {
    return 'string' === typeof input;
  } else if (shape instanceof ValidateNumber) {
    return 'number' === typeof input;
  } else if (shape instanceof ValidateBoolean) {
    return 'boolean' === typeof input;
  }
  return false;
};

// convert S to the guarded type
const hello: any = 'world';

if (validateIs(hello, new ValidateString())) {
  hello;
} else if (validateIs(hello, new ValidateNumber())) {
  hello;
} else if (validateIs(hello, new ValidateBoolean())) {
  hello;
} else if (validateIs(hello, new ValidateShape({ testOne: new ValidateString() }))) {
  //
}
