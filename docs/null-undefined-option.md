---
id: null-undefined-option
title: Null, Undefined & Option
---

OCaml itself doesn't have the notion of `null` or `undefined`. This is a _great_ thing, as it wipes out an entire category of bugs.

BuckleScript provides bindings to `null` and `undefined` through [`Js.Nullable`](https://bucklescript.github.io/bucklescript/api/Js.Nullable.html), since it's pretty much required for JavaScript.

## Examples

To create a JS `null`, use the value `Js.Nullable.null`. To create a Js `undefined`, use `Js.Nullable.undefined`.

If you're receiving, for example, a JS string that can also be null, type it as:

```ocaml
let theJsValue: string Js.Nullable.t = /* the value you've gotten here */
```

Reason syntax:

```reason
let theJsValue: Js.Nullable.t(string) = /* the value you've gotten here */
```

To create a nullable string, do:

```ocaml
let nullableString = Js.Nullable.return "hello"
```

Reason syntax:

```reason
let nullableString = Js.Nullable.return("hello");
```

The `return` part "wraps" a string into a nullable string, to make the type system understand and track the fact that, as you pass this value around, it's not just a string, but a string that can be `null` or `undefined`. Tada! No more nullable bugs!

## Option

This is the idiomatic way of working with the concept of "no value" in BuckleScript/OCaml/Reason. [The Reason docs on variants](https://reasonml.github.io/guide/language/variant#option) describes option in more detail.

`Js.Nullable.from_opt` converts from a `Js.Nullable.t` to `option`. `Js.Nullable.to_opt` does the opposite.
