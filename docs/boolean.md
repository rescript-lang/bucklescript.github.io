---
id: boolean
title: Boolean
---

BuckleScript/OCaml's `true`/`false` `bool` **does not** compile to JavaScript's `true`/`false`. The former compiles to `0` and `1` (don't rely on this from the JS side).

The type for BuckleScript boolean is `bool`. The type for JS boolean is `Js.boolean`.

We expose [`Js.true_`](https://bucklescript.github.io/bucklescript/api/Js.html#VALtrue_) and [`Js.false_`](https://bucklescript.github.io/bucklescript/api/Js.html#VALfalse_) which compile to JS `true` and `false`.

`Js.to_bool` converts from JS `boolean` to BS `bool`. `Js.Boolean.to_js_boolean` is the opposite.

### Tips & Tricks

If you mark an `external` as returning `bool`, we automatically understands it as wanting to return a `Js.boolean` (since the JS side can never return a BuckleScript `bool`), and will do an implicit conversion:

```ocaml
external isStudent: string -> bool = "isStudent" [@@bs.val]
```

Reason syntax:

```reason
[@bs.val] external isStudent : string => bool = "isStudent";
```

You don't have to use `string -> Js.boolean` and then do an explicit conversion though `Js.to_bool` yourself!

The implicit conversion's cost is also very small; BS will even remove such coercion when not needed.

### Design Decisions

`bool` mapping to `boolean` would have been an obvious feature, given that we do the same for string, float, array, etc. Unfortunately, due to some existing limitations in the architecture, we can't do this yet.
