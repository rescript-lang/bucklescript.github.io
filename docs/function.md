---
id: function
title: Function
---

Binding to JS functions is like binding to a normal value:

```ocaml
external encodeURI: string -> string = "encodeURI" [@@bs.val]
let result = encodeURI "hello"
```

Reason syntax:

```reason
[@bs.val] external encodeURI : string => string = "encodeURI";
let result = encodeURI("hello");
```

We also expose a few special features, described below.

## Labeled Arguments

OCaml has labeled arguments (that are potentially optional). These work on an `external` too! You'd use them to _fix_ a JS function's unclear usage. Assuming we're binding to this:

```js
function draw(x, y, border) {
   /* border is optional, defaults to false */
}
draw(10, 20)
draw(20, 20, true)
```

It'd be nice if on the BS side, we can bind & call `draw` while labeling things a bit:

```ocaml
external draw : x:int -> y:int -> ?border:Js.boolean -> unit -> unit = "" [@@bs.val]

let _ = draw ~x:10 ~y:20 ~border:Js.true_ ()
let _ = draw ~x:10 ~y:20 ()
```

Reason syntax:

```reason
[@bs.val] external draw: (~x:int, ~y:int, ~border:Js.boolean=?, unit) => unit = "";

draw(~x=10, ~y=20, ~border=Js.true_, ());
draw(~x=10, ~y=20, ());
```

Output:

```js
draw(10, 20, true);
draw(10, 20, undefined);
```

We've compiled to the same function, but now the usage is much clearer on the BS side thanks to labels!

**Note**: in this particular case, you need a unit, `()` after `border`, since `border` is an [optional argument at the last position](https://reasonml.github.io/guide/language/function#optional-labeled-arguments). Not having a unit to indicate you've finished applying the function would generate a warning.

## Variadic Function Arguments

You might have JS functions that take an arbitrary amount of arguments. BuckleScript supports binding to those, under the condition that the arbitrary arguments part is homogenous (aka of the same type). If so, add `bs.splice` to your `external`.

```ocaml
external join : string array -> string = "" [@@bs.module "path"] [@@bs.splice]
let v = join [| "a"; "b"|]
```

Reason syntax:

```reason
[@bs.module "path"] [@bs.splice] external join : array(string) => string = "";
let v = join([|"a", "b"|]);
```

Output:

```js
var Path = require("path");
var v = Path.join("a","b");
```

_`bs.module` will be explaned in the Import & Export section next_.

## Binding to Polymorphic Function

Apart from the above special-case, JS function in general are often arbitrary overloaded in terms of argument types and number. How would you bind to those?

### Trick 1: Multiple `external`s

If you can exhaustively enumerate the many forms an overloaded JS function can take, simply bind to each differently:

```ocaml
external drawCat: unit -> unit = "draw" [@@bs.module "Drawing"]
external drawDog: giveName:string -> unit = "draw" [@@bs.module "Drawing"]
external draw : string -> useRandomAnimal:Js.boolean -> unit = "draw" [@@bs.module "Drawing"]
```

Reason syntax:

```reason
[@bs.module "Drawing"] external drawCat : unit => unit = "draw";
[@bs.module "Drawing"] external drawDog : (~giveName: string) => unit = "draw";
[@bs.module "Drawing"] external draw : (string, ~useRandomAnimal: Js.boolean) => unit = "draw";
```

Note how all three externals bind to the same JS function, `draw`.

### Trick 2: Polymorphic Variant + `bs.unwrap`

If you have the irresistible urge of saying "if only this JS function argument was a variant instead of informally being either `string` or `int`", then good news: we do provide such `external` features through annotating a parameter as a polymorphic variant! Assuming you have the following JS function you'd like to bind to:

```js
function padLeft(string, padding) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

Here, `padding` is really conceptually a variant. Let's model it as such.

```ocaml
external padLeft :
  string
  -> ([ `Str of string
      | `Int of int
      ] [@bs.unwrap])
  -> string
  = "" [@@bs.val]

let _ = padLeft "Hello World" (`Int 4)
let _ = padLeft "Hello World" (`Str "Message from BS: ")
```

Reason syntax:

```reason
[@bs.val]
external padLeft : (
  string,
  [@bs.unwrap] [
    | `Str(string)
    | `Int(int)
  ])
  => string = "";

padLeft("Hello World", `Int(4));
padLeft("Hello World", `Str("Message from BS: "));
```

Obviously, the JS side couldn't have an argument that's a polymorphic variant! But here, we're just piggy backing on poly variants' type checking and syntax. The secret is the `[@bs.unwrap]` annotation on the type. It strips the variant constructors and compile to just the payload's value. Output:

```js
padLeft("Hello World", 4);
padLeft("Hello World", "Message from BS: ");
```

## Constraint Arguments Better

**Note**: bonus interop feature. Skip if you're bored.

Consider the Node `fs.readFileSync`'s second argument. It can take a string, but really only a defined set: `"ascii"`, `"utf8"`, etc. You can still bind it as a string, but we can use poly variants + `bs.string` to ensure that our usage's more correct:

```ocaml
external readFileSync :
  name:string ->
  ([ `utf8
   | `useAscii [@bs.as "ascii"]
   ] [@bs.string]) ->
  string = ""
  [@@bs.module "fs"]

let _ = readFileSync ~name:"xx.txt" `useAscii
```

Reason syntax:

```reason
[@bs.module "fs"]
external readFileSync : (
  ~name: string,
  [@bs.string] [
    | `utf8
    | [@bs.as "ascii"] `useAscii
  ])
  => string = "";

readFileSync(~name="xx.txt", `useAscii);
```

Output:

```js
var Fs = require("fs");
Fs.readFileSync("xx.txt", "ascii");
```

- Attaching `[@bs.string]` to the whole poly variant type makes its constructor compile to a string of the same name.

- Attaching a `[@bs.as "foo"]` to a constructor lets you customize the final string.

And now, passing something like `"myOwnUnicode"` or other variant constructor names to `readFileSync` would correctly error.

## Curry & Uncurry

Curry is a delicious Indian dish. More importantly, in the context of BuckleScript (and functional programming in general), currying means that function taking multiple arguments can be applied a few arguments at time, until all the arguments are applied.

```ocaml
let add x y z = x + y + z
let addFive = add 5
let twelve = addFive 3 4
```

Reason syntax:

```reason
let add = (x, y, z) => x + y + z;
let addFive = add(5);
let twelve = addFive(3, 4);
```

See the `addFive` intermediate function? `add` takes in 3 arguments but received only 1. It's interpreted as "currying" the argument `5` and waiting for the next 2 arguments to be applied later on. Type signatures:

```ocaml
val add: int -> int -> int -> int
val addFive: int -> int -> int
val twelve: int
```

Reason syntax:

```reason
let add: (int, int, int) => int;
let addFive: (int, int) => int;
let twelve: int;
```

(In a dynamic language such as JS, currying would be dangerous, since accidentally forgetting to pass an argument doesn't error at compile time).

### Drawback

Unfortunately, due to JS not having currying because of the aforementioned reason, it's hard for BS multi-argument functions to map cleanly to JS functions 100% of the time:

1. When all the arguments of a function are supplied (aka no currying), BS does its best to to compile e.g. a 3-arguments call into a plain JS call with 3 arguments.

2. If it's too hard to detect whether a function application is complete\*, BS will use a runtime mechanism (the `Curry` module) to curry as many args as we can and check whether the result is fully applied.

3. Some JS APIs like `throttle`, `debounce` and `promise` might mess with context, aka use the function `bind` mechanism, carry around `this`, etc. Such implementation clashes with the previous currying logic.

\* If the call site is typed as having 3 arguments, we sometimes don't know whether it's a function that's being curried, or if the original one indeed has only 3 arguments.

BS tries to do #1 as much as it can. Even when it bails and uses #2's currying mechanism, it's usually harmless.

**However**, if you encounter #3, heuristics are not good enough: you need a guaranteed way of fully applying a function, without intermediate currying steps. We provide such guarantee through the use of the `[@bs]` "uncurrying" annotation on a function declaration & call site.

### Solution: Guaranteed Uncurrying

If you annotate a function declaration signature on an `external` or simple `let` with a `[@bs]`, you turn that function into an similar-looking one that's uncurry-able:

```ocaml
type timerId
external setTimeout : (unit -> unit [@bs]) -> int -> timerId = "setTimeout" [@@bs.val]

let id = setTimeout (fun [@bs] () -> Js.log "hello") 1000
```

Reason syntax:

```reason
type timerId;
[@bs.val] external setTimeout : ([@bs] (unit => unit), int) => timerId = "setTimeout";

let id = setTimeout([@bs] (() => Js.log("hello")), 1000);
```

**Note**: both the declaration site and the call site need to have the `[@bs]` annotation.

When you try to curry such a function, you'll get a type error:

```ocaml
let add = fun [@bs] x y z -> x + y + z
let addFiveOops = add 5
```

Reason syntax:

```reason
let add = [@bs] ((x, y, z) => x + y + z);
let addFiveOops = add(5);
```

```
This is an uncurried bucklescript function. It must be applied with [@bs].
```

#### Extra Solution

The above solution is safe, guaranteed, and performant, but sometimes visually a little burdensome. We provide an alternative solution if:

- you're binding with `external`

- the `external` function takes in an argument that's another function

- you want the user not to need to annotate the call sites with `[@bs]`

<!-- TODO: is this up-to-date info? -->

Then try `[@bs.uncurry]`:

```ocaml
external map : 'a array -> ('a -> 'b [@bs.uncurry]) -> 'b array = "" [@@bs.send]
let _ = map [|1; 2; 3|] (fun x -> x+ 1)
```

Reason syntax:

```reason
[@bs.send] external map : (array('a), [@bs.uncurry] ('a => 'b)) => array('b) = "";
map([|1, 2, 3|], (x) => x + 1);
```

##### Design Decisions

In general, `bs.uncurry` is recommended; the compiler will do lots of optimizations to resolve the currying to uncurrying at compile time. However, there are some cases the compiler can't optimize it. In these case, it will be converted to a runtime check.

This means `[@bs]` are completely static behavior (no runtime cost), while `[@bs.uncurry]` is more convenient for end users but, in some rare cases, might be slower than `[@bs]`.

