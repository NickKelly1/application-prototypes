console.log('hello world');
import { IValidator, Validator, ValidationResult } from 'ts.validator.fluent/dist';

class Employee {
  public name: string;
  public password: string;
  public previousPasswords: string[];
  public creditCards: number[];
  public email: string;

  public constructor(name: string, previousPasswords: string[], password: string, creditCards: number[], email: string) {
    this.name = name;
    this.previousPasswords = previousPasswords;
    this.password = password;
    this.creditCards = creditCards;
    this.email = email;
  }
}

let validateEmployeeRules = (validator: IValidator<Employee>): ValidationResult => {
  return validator
    .NotEmpty(m => m.Name, 'Should not be empty', 'Employee.Name.Empty')
    .NotNull(m => m.CreditCards, 'Should not be null', 'CreditCard.Null')
    .NotNull(m => m.Super, 'Should not be null', 'Super.Null')
    .NotEmpty(m => m.Email, 'Should not be empty', 'Employee.Email.Empty')
    .If(m => m.Super != null, validator => validator.ForType(m => m.Super, validateSuperRules).ToResult())
    .If(
      m => m.Email != '',
      validator => validator.Email(m => m.Email, 'Should not be invalid', 'Employee.Email.Invalid').ToResult(),
    )
    .Required(
      m => m.CreditCards,
      (m, creditCards) => creditCards.length > 0,
      'Must have atleast 1 credit card',
      'Employee.CreditCards.Required',
    )
    .If(
      m => m.CreditCards != null && m.CreditCards.length > 0,
      validator => validator.ForEach(m => m.CreditCards, validateCreditCardRules).ToResult(),
    )
    .If(
      m => m.Password != '',
      validator =>
        validator
          .ForStringProperty(
            m => m.Password,
            passwordValidator =>
              passwordValidator
                .Matches(
                  '(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])',
                  'Password strength is not valid',
                  'Employee.Password.Strength',
                )
                .Required((m, pwd) => pwd.length > 3, 'Password length should be greater than 3', 'Employee.Password.Length')
                .Required(
                  (m, pwd) => !m.PreviousPasswords.some(prevPwd => prevPwd == pwd),
                  'Password is already used',
                  'Employee.Password.AlreadyUsed',
                )
                .ToResult(),
          )
          .ToResult(),
    )
    .ToResult();
};

const model = 'asd';

if (validateEmployeeRules(model).IsValid) {
  model;
}
