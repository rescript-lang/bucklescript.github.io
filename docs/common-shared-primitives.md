---
id: common-shared-primitives
title: Common Shared Primitives
---

BuckleScript's primitives such as `string`, `float`, `array` and a few others have a rather interesting property: they compile to the exact same thing in JavaScript. Thanks to this, there's close to no API to learn.

This means that if you receive e.g. a string from the JS side, you can use it without conversion on the BS side, and vice-versa. In other words, string and others are "_guaranteed representations_".

P.S. if you need an overview of the language primitives themselves, see [the Reason docs](https://reasonml.github.io/guide/language).

**BuckleScript uses the same standard library as OCaml**; see the docs [here](https://reasonml.github.io/api/) (in Reason syntax). **Additionally**, we provide the bindings to all the familiar JS primitives [here](https://bucklescript.github.io/bucklescript/api/Js). You can mix and match these two.

## String

Immutable on both sides, as expected. [BuckleScript String API](https://reasonml.github.io/api/String.html). [JS String API](https://bucklescript.github.io/bucklescript/api/Js.String.html#VALdefault).

## Float

BuckleScript floats are JS numbers, vice-versa. The OCaml standard library doesn't come with a Float module. JS Float API is [here](https://bucklescript.github.io/bucklescript/api/Js.Float.html).

## Int

**Ints are 32-bits**! Be careful, you can potentially treat them as JS numbers and vice-versa, but if the number's large, then you better treat JS numbers as floats. For example, we bind to Js.Date using `float`s. Js Int API [here](https://bucklescript.github.io/bucklescript/api/Js.Int.html).

## Array

Idiomatic OCaml arrays are supposed to be fix-sized. This constraint is relaxed on the BuckleScript size. You can change its length using the usual [JS Array API](https://bucklescript.github.io/bucklescript/api/Js.Array.html#VALdefault). BuckleScript String API [here](https://reasonml.github.io/api/Array.html).

<!-- TODO: playground link -->
<!-- TODO: API docs revamp -->

