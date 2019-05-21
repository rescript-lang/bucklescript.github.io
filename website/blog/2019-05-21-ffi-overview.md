---
title: A high level overview of BuckleScript interop with Javascript
---

When user starts to use BuckleScript to develop applications on JS platform, they have to interop with various APIs provided by JS platform. 

In theory, like [Elm](https://elm-lang.org/), bucklescript could ship a comperhensive library which contains what most people would like to use daily, but this is in particular 
challenging given JS is running on so many platforms for example, [Electron](https://electronjs.org/), [Node](https://nodejs.org/) and Browser,  yet eatch platform is still evolving quickly. So we have to provide a mechanism to allow users to binding to native JS API quickly in the userland.

There are lots of trade-off when design such a FFI bridge between OCaml and JavaScript API, below we list a few key items which we think has an important impact on our design.

## Interop design constraints

- BuckleScript is still OCaml

    We are not inventing a new language, in particular, we can not change the concrete syntax of OCaml. Luckily, OCaml introduced [attributes](https://caml.inria.fr/pub/docs/manual-ocaml/extn.html#sec260) and [extension nodes](https://caml.inria.fr/pub/docs/manual-ocaml/extn.html#sec262) since 4.02, which allows us to customize the language in a minor style. To be a good citizen in the OCaml community, all attributes introduced by BuckleScript are prefixed with `bs`.

- Bare metal efficiency should always be possible for experts in pure OCaml

    Efficency is at the heart of BuckleScript's design philosophy, in terms of both compilation speed and runtime performance. There are also other strongly typed functional languages running on JS platform before we made BuckleScript, one thing in particular confused me is that in those languages, people have to write `native JS` to gain performance. Our goal is that when performance really matters, it is still possible for experts to write pure OCaml without digging into `native JS`, users don't have to make a choice between performance and type safety.



## Easy interop using raw JS

BuckleScript allows users to insert raw JS using extension nodes directly, please refer to the [documentation](https://bucklescript.github.io/docs/en/embed-raw-javascript) for details. Here we only talk about one of the most used style, insert raw JS code as a function.

```ocaml
let getSafe : int array -> int -> int = fun%raw a b -> {| 
	if(b>=0 && b < a.length) {
    	return a [b]
     }
     throw new Error("out of range")
  |} 

let v = getSafe [|1;2;3|] (-1)
```

Here the raw extension node asks user to list the parameters and function statement in raw JS syntax. The generated JS code is as below:

```js
function getSafe (a,b){ 
	if(b>=0 && b < a.length) {
    	return a [b]
     }
     throw new Error("out of range")
  };

var v = getSafe(/* array */[
      1,
      2,
      3
    ], -1);

```

Insert raw JS code as a function has several advantages:

- It is relatively safe, no variable name polluting 
- It is quite expressive since user can express everything inside the function body
- The compiler still has some knowledge about such function, arity, for example.

Some advice of using such style:
- Always annotate the raw function with explicit type annotation
- Such type annotation is as polymorphic as you need, don't create polymorphic types when you don't need it
- Write a test for such function

Note that a nice thing about such mechanism is that no separate JS file is needed so no change to the build system is need in most cases, using such mechanism, BuckleScript users can already deal with most bindings