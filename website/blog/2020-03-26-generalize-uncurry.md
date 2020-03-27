---
title: Generalized uncurry support in BuckleScript 7.3
---


[ReasonML](https://github.com/facebook/reason) is a [curried](https://en.wikipedia.org/wiki/Currying) language, while Js is an uncurried language. When compiling ReasonML into Js, there's lots of headache due to the semantics mismatch. 

After several years of reasearch and development, we reach an ideal situation in next release: adding a lightweight uncurried calling convention to ReasonML.

## Why we need native uncurried calling convention

- Curried call is inherently slower than uncurried call.

    A native implementation of curried call like [purescript](https://www.purescript.org/) does will generate very slow code:

    ```js
    let curriedFunction = x => y => z => x + y +z ;
    let curriedApply = curriedFunction(1)(2)(3); // memory allocation triggered
    ```

    BuckleScript does tons of optimizations and very aggressive arity inference so that the curried function is actually compiled into multiple-arity function, and when the application is supplied with the exact arguments -- which is true in most cases, it is applied like normal functions.

    However, such optimization does not apply to high order functions:

    ```reasonml
    let highOrder = (f,a,b)=> f (a, b) 
    // can not infer the arity of `f` since we know
    // nothing about the arity of `f`, unless
    // we do the whole program optimization
    ```

    In cases where arity infer does not help, the arity guessing has to be delayed into runtime.

- Bindings to JS world

    When we create bindings for high order functions in the JS world, we would like to have native uncurried functions which behave the same as JS world -- no semantics mismatch.


## Generalized uncurried calling convention in this release

Prior to release 7.3, we had introduced uncurried calling convention, however, it has serious limitations -- uncurried functions can not be polymorphic, it does not support labels, the error 
message leaks the underlying encoding -- now all those limitations are gone!

Previously 

<img src="/img/poly-error.png">


<img src="/img/label-error.png">

<img src="/img/recursive-error.png" >

The error messages above are cryptic and hard to understand. And the limitation of not supporting recursive functions make uncurried support pretty weak. 

Now those limitations are all gone, you can have polymoprhic uncurried recursive functions and it support labels.

<img src="/img/uncurry-label.png">

<img src="/img/recursive.png">

The error message is  also enhanced significantly

- When uncurried functon is used in curried

    ```reasonml
    let add = (. x, y ) => x + y;

    let u = add (1, 2)
    ```

    The old error message:

    ```
    Error: This expression has type (. int, int) => int
        This is not a function; it cannot be applied.
    ```

    The new error message
    ```
    Error: This function has uncurried type, it needs to be applied in ucurried style
    ```
- When curried function is used in uncurried context

    ```reasonml

    let add = ( x, y ) => x + y;

    let u = add (.1, 2)
    ```

    The old error message:
    ```
    Error: This expression has type (int, int) => int
        but an expression was expected of type (. 'a, 'b) => 'c
    ```

    The new error message:
    ```
    Error: This function is a curried function where an uncurried function is expected
    ```

- When arity mismatch 

    ```reasonml
    let add = (. x, y ) => x + y;

    let u = add (.1, 2,3)
    ```

    The old message:
    ```
    Error: This expression has type (. int, int) => int
        but an expression was expected of type (. 'a, 'b, 'c) => 'd
        These two variant types have no intersection
    ```

    The new message:
    ```
    Error: This function has arity2 but was expected arity3
    ```

Note the generalized uncurry support also applies to objects, so that you can use `obj##meth (~label1=a,~label2=b)`.

The only thing where uncurried call  is not supported is optional arguments, if users are mostly targeting JS runtime, we suggest you can try uncurry by default and would like to hear your feedback!

You can already test it today by `npm install bs-platform@7.3.0-dev.1` (Windows support will be coming soon).

