interface foo {
  (a: string, b: number): Symbol;
}

let myFn: foo;

myFn = (x: string, y: number) => {
  return Symbol('123');
};
