class Employee {
  /** @type {string} */
  name;

  /** @type {string} */
  email;

  /** @type {{}} */
  parent;

  static get testStaticGet() {
    return 'world';
  }

  constructor(name, email, parent) {
    if ('string' !== typeof name) throw new TypeError('name must be a string');
    if ('string' !== typeof email) throw new TypeError('name must be a string');
    if (!(parent instanceof Object)) throw new TypeError('parent must be an object');
    this.name = name;
    this.email = email;
    this.parent = parent;
  }
}

const z = new Employee('hello', 'world');

z.parent;
