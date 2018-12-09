---
title: Overview
---

BuckleScript is mostly just OCaml, so they share the same standard library:

* [OCaml syntax standard library documentation](https://caml.inria.fr/pub/docs/manual-ocaml-4.02/stdlib.html).
* [Reason syntax standard library documentation](https://reasonml.github.io/api/index.html).

**Note** that BuckleScript is currently at OCaml v4.02.3. We will upgrade to a newer OCaml later on.

In addition, we provide a few extra modules:

- [Belt](https://bucklescript.github.io/bucklescript/api/Belt.html): the BuckleScript standard library (<b>beta</b>). This standard library provides useful functions in addition to the OCaml standard library.
- [Dom](https://bucklescript.github.io/bucklescript/api/Dom.html): contains DOM types. The DOM is very hard to bind to, so we've decided to only keep the types in the stdlib and let users bind to the subset of DOM they need downstream.
- [Node](https://bucklescript.github.io/bucklescript/api/Node.html): for node-specific APIs. Experimental; contribution welcome!
- [Js](https://bucklescript.github.io/bucklescript/api/Js.html): all the familiar JS APIs and modules are here! E.g. if you want to use the [JS Array API](https://bucklescript.github.io/bucklescript/api/Js.Array.html) over the [OCaml Array API](https://caml.inria.fr/pub/docs/manual-ocaml-4.02/libref/Array.html) because you're more familiar with the former, go ahead.

The full index of modules is available at: <https://bucklescript.github.io/bucklescript/api/>
