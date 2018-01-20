---
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
let nullableString: string Js.Nullable.t = Js.Nullable.return "hello"
```

Reason syntax:

```reason
let nullableString: Js.Nullable.t(string) = Js.Nullable.return("hello");
```

The `return` part "wraps" a string into a nullable string, to make the type system understand and track the fact that, as you pass this value around, it's not just a string, but a string that can be `null` or `undefined`. Tada! No more nullable bugs!

## Option

This is the idiomatic way of working with the concept of "no value" in BuckleScript/OCaml/Reason. [The Reason docs on variants](https://reasonml.github.io/docs/en/variant.html) describes option in more detail.

`Js.Nullable.from_opt` converts from a `option` to `Js.Nullable.t`. `Js.Nullable.to_opt` does the opposite.

**The `Option` helper module** is [here](https://bucklescript.github.io/bucklescript/api/Js.Option.html).

## Tips & Tricks

In an external, you can directly convert a `Js.Nullable.t` into an `option` through `bs.return nullable`:

```ocaml
type element
external getElementById : string -> element option = "getElementById" [@@bs.scope "document"][@@bs.return nullable]
```

Reason syntax:

```reason
type element;
[@bs.return nullable] [@bs.scope "document"] external getElementById : string => option(element) = "getElementById";
```

When you use `getElementById`, it'll implicitly convert the JS nullable string into an option. Saves you an explicit conversion through `Js.Nullable.to_opt`.

### Design Decisions

OCaml/BuckleScript option is a "boxed" value. Under BuckleScript, a `None` is compiled into `0` and a `Some foo` is compiled into `[foo]`. The above `bs.return nullable` smartly removes such boxing overhead when the returned value is destructed in the same routine.
