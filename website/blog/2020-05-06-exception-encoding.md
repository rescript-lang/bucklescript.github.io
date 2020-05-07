---
title: A story of exception encoding in BuckleScript
---

In the master branch of our compiler, we made some significant improvement in exception encoding: it gives all ReasonML/OCaml exceptions a clear stack-trace when it is thrown. This is particular important when you have some code running in production so that collect those stacktrace for diagnostics.

## Why it is tricky to preserve stack-traces in ReasonML exceptions

Whenever you are using a Reason / OCaml exception (a so called "native exception"), you are actually using a data structure which is not the same as a JS runtime exception. That means that each exception representation invoke different stacktrace handling mechanisms:

In JS, the stacktrace is collected immediately when an Error object is thrown, while in native Reason / OCaml, such data is not attached to the exception object at all (you can't just access `e.stack` to retrieve the stacktrace). This is because collecting the stacktrace in a native environment highly depends on the runtime support (e.g. if a flag was provided to attach the stacktrace data).

So, to preserve a clear stacktrace we need change the encoding of the exception in ReasonML to better fit JS use case, this is part of our on-going work to choose the optimal encoding for all ReasonML data types.

## What's the classical ReasonML exception encoding?

In ReasonML, an exception is basically structured data. Let's have a look at the two exception definitions below:

```reasonml
exception A of { x : int , y : string}
exception B
```

`exception A` is encoded as an array of 3 slots, the first slot is a block by itself called identity block, while the second slot is for field x and the third slot for field y.

`exception B` is just the identity block.

The identity block is an array of 2 slots whose first slot is a string like "B", while the second slot is a unique integer, such array in native also has a magic tag 248 for other purposes.

Previously we more or less faithfully do the similar encoding in BuckleScript compiler, but it is no longer case,  now it is much simplified, take two exception values below for example

```reasonml
A ({ x : 1, y : "x"}
B
```

It will be compiled into

```js
{RE_EXN_ID : "A/uuid", x : 1, y : "x" }
{RE_EXN_ID : "B/uuid"}
```
exceptions with or without payload share the same encoding.

What will happen when you raise an exception?

```reasonml
raise (A {x : 1 , y : "x"})
````


```js
throw {RE_EXN_ID: "A/uuid", x : 1 , y : "x", Error : new Error ()}
```

Here the compiler attached a stacktrace here, it is much simpler since now we compile exception value into an object instead of an array.

## What's the story of JS interop

Note that in JS world, user can throw anything, it is even valid to `throw undefined`. When ReasonML tries to catch the exception, the compiler behind the scene will convert an arbitrary exception to a ReasonML exception: if it is already ReasonML exception, the conversion is a nop, if it is not, it will be wrapped as `Js.Exn.Error obj`.

```reasonml
try ( ... ) {
| Not_found => ..  // catch  reasonml exception 1 
| Invalid_argument =>  // catch  reasonml exception 2
| Js.Exn.Error (obj) => ... // catch js exception
}
```

`obj` is of an opaque type to maintain type soundness.

## Caveat

Don't rely on the key name of `RE_EXN_ID`, it is an implementation detail which you should not rely on and it is subject to be changed into a symbol in the future.

## Bonus

With such nice encoding, a hidden feature called [extensible variant](https://caml.inria.fr/pub/docs/manual-ocaml/extensiblevariants.html) is much more useful. exception in ReasonML is a special instance of extensible variant, they share the same encoding.

Happy hacking and we would like your feedback!
