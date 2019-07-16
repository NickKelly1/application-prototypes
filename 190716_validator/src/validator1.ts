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
  //
  return true;
};

const data = new Employee();

if (validateEmployeeRules(data)) {
  //
} else {
  //
}
