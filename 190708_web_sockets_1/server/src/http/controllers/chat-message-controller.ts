export class ChatMessageController {
  public index = async (req, res) => {
    //
  };

  public show = async (req, res) => {
    //
  };

  public update = async (req, res) => {
    //
  };

  public delete = async (req, res) => {
    //
  };
}

class Type<A, O, I> {
  readonly _A!: A;
  readonly _O!: O;
  readonly _I!: I;

  public constructor({
    /** a unique name for this codec */
    readonly name: string,
    /** a custom type guard */
    readonly is: (u: unknown) => u is A,
    /** succeeds if a value of type I can be decoded to either a value of type A */
    readonly validate: (input: I, context: Context) => Either(Errors, A),
    /** converts a value of type A to a value of type O */
    readonly encode: (a: A) => O,
  }) {}

  /** a version of `validate`with a default context */
  decode(i: I): Either<Errors, A>
}
