class Observable {
  fnArray: Array<Function>;

  constructor() {
    this.fnArray = []; //array of subscribed objects
  }

  subscribe(fn: Function) {
    this.fnArray.push(fn);
  }

  /**
   * loop over the array of functions and execute them one after another
   */
  emit(v: unknown) {
    this.fnArray.map((fun) => fun(v));
  }
}

function printThis(thing: string | number) {
  console.log(`I will print this ${thing}`);
}

const ob = new Observable();

/**
 * subscribe to a function / event and emit something based on that function
 */
ob.subscribe(printThis);
ob.emit('Apple');
ob.emit('Banana');

/**
 * subscribing to multiple functions
 */
ob.subscribe((x: number) => console.log(x * 2));
ob.subscribe((x: number) => console.log(x + 2));
ob.emit(4);

/**
 * Without Pipe
 */
const square = (num: number) => num * num;
ob.subscribe((x: number) => printThis(square(x)));
ob.emit(10);

/**
 * Using Pipe
 */
const pipe = (f: Function, g: Function) => (x: number) => g(f(x));

ob.subscribe(pipe(square, printThis));
ob.emit(4);

/**
 *  pass n number of functions and compose them.
 */
const pipe2 =
  (...funcs: Function[]) =>
  (x: number) =>
    funcs.reduce((effects, f) => f(effects), x);
const double = (x: number) => x + x;
ob.subscribe(pipe2(square, double, printThis));
ob.emit(4);

/**
 * collect funnelled data using Tap
 */
const tap = (fun: Function) => (x: number) => {
  fun(x);
  return x;
};

ob.subscribe(pipe2(square, tap(printThis), double, printThis));
ob.emit(4);

export {};
