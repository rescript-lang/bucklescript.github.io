---
title: A story of exception encoding in BuckleScript
---

We just recently made some significant improvements with our new exception encoding and we find it so exciting that we want to highlight the changes and explain a little bit how exceptions work when compiling to JS.

The new encoding allows us to provide proper, clear stacktrace information whenever a Reason/OCaml exception is thrown. This is particularly important when you have some code running in production that needs to collect those stacktrace for diagnostics.

What's the difference? 

```reasonml
exception My_exception { x : int};

let loop = () => {
 for (i in 0 to 100) {
   if (i == 10) {
     raise (My_exception { x : i})
   };
 };
};
loop ();
```
When running such piece of code in production, the old behavior is 

```
exn_demo$node src/exn_demo.bs.js 

/Users/hongbozhang/git/exn_demo/src/exn_demo.bs.js:11
      throw [
      ^
[ [ 'Exn_demo.My_exception', 1, tag: 248 ], 10 ]
```

With our improvement, it is now:
```
bucklescript$node jscomp/test/exn_demo.js

/Users/hongbozhang/git/bucklescript/jscomp/test/exn_demo.js:10
      throw {
      ^
{
  RE_EXN_ID: 'Exn_demo.My_exception/1',
  x: 10,
  Error: Error
      at loop (/Users/hongbozhang/git/bucklescript/jscomp/test/exn_demo.js:13:20)
      at Object.<anonymous> (/Users/hongbozhang/git/bucklescript/jscomp/test/exn_demo.js:21:1)
      at ...
}
```

 
Now let's get into the details how we changed things up!

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

`exception A` is encoded as an array of 3 slots. The first slot is a block by itself (called an *identity block*), while the second slot is for field x and the third slot for field y.

`exception B` is just the identity block.

The identity block is an array of 2 slots. The first slot is a string like "B", while the second slot is a unique integer. 
In more detail, the native array will also have a magic tag 248 attached which is not relevant for our purposes though.

## What's the new exception encoding?

We had to simplify and unify the encoding for the different exception cases to make it possible to compile exceptions into an object instead of an array. Let's take a look at the two exception values below for example:

```reasonml
A ({ x : 1, y : "x"}
B
```

The two values will be compiled into

```js
{RE_EXN_ID : "A/uuid", x : 1, y : "x" }
{RE_EXN_ID : "B/uuid"}
```
As you can see, all exceptions (no matter with or without payload) share the same encoding.

What will happen when you raise an exception?

```reasonml
raise (A {x : 1 , y : "x"})
````

It generates following JS:

```js
throw {RE_EXN_ID: "A/uuid", x : 1 , y : "x", Error : new Error ()}
```

You can see in the compiled output that we can now attach the stacktrace very easily since every exception is now an object instead of an array. Really cool!

Note the stacktrace is only attached when you raise an exception is, it's untouched when you pass exception objects along. 

## What's the story of JS interop

Note that in JS world, users can throw anything, it is even valid to `throw undefined`. When ReasonML tries to catch the exception, the compiler behind the scene will convert an arbitrary exception to a ReasonML exception: if it is already ReasonML exception, the conversion is a nop, if it is not, it will be wrapped as `Js.Exn.Error obj`.

```reasonml
try ( ... ) {
| Not_found => ..  // catch  reasonml exception 1 
| Invalid_argument =>  // catch  reasonml exception 2
| Js.Exn.Error (obj) => ... // catch js exception
}
```

`obj` is of an opaque type to maintain type soundness.

## Caveat

- Please note that it's not allowed to rely on the key name of `RE_EXN_ID`. It's an implementation detail which will probably be changed into a symbol in the future.

- Don't over-use exeptions, remember exception should only be used in exceptional cases like division by zero.

## Bonus

With our nice new exception encoding, a hidden feature called [extensible variant](https://caml.inria.fr/pub/docs/manual-ocaml/extensiblevariants.html) is now way more useful. This  is because a native exception in ReasonML is actually a special instance of an extensible variant. They share the same encoding, so both benefit from the new changes!

Happy hacking and we would like your feedback!
