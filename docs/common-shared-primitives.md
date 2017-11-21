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

### Unicode Support

OCaml string is an immutable byte sequence. If the user types some unicode:

```ocaml
Js.log "你好"
```

It'll compile to the follow JS:

```js
console.log("\xe4\xbd\xa0\xe5\xa5\xbd");
```

Which gives you cryptic console output. To rectify this, BuckleScript exposes a special `js` annotation to the default [quoted string syntax](https://reasonml.github.io/guide/language/string-and-char/#quoted-string) built into the language. Use it like this:

```ocaml
Js.log {js|你好，
世界|js}
```

This'll correctly output:

```js
console.log("你好，\n世界");
```

### Interpolation

For convenience, we also expose another special tag quoted string annotation, `j`, which supports the equivalent of JS' string interpolation:

```ocaml
let world = {j|世界|j}
let helloWorld = {j|你好，$world|j}
```

You can surround the variable in parentheses too: `{j|你好，$(world)|j}`.

## Float

BuckleScript floats are JS numbers, vice-versa. The OCaml standard library doesn't come with a Float module. JS Float API is [here](https://bucklescript.github.io/bucklescript/api/Js.Float.html).

## Int

**Ints are 32-bits**! Be careful, you can potentially treat them as JS numbers and vice-versa, but if the number's large, then you better treat JS numbers as floats. For example, we bind to Js.Date using `float`s. Js Int API [here](https://bucklescript.github.io/bucklescript/api/Js.Int.html).

## Array

Idiomatic OCaml arrays are supposed to be fix-sized. This constraint is relaxed on the BuckleScript size. You can change its length using the usual [JS Array API](https://bucklescript.github.io/bucklescript/api/Js.Array.html#VALdefault). BuckleScript String API [here](https://reasonml.github.io/api/Array.html).

### Design Decisions

There's another array-like data structure in OCaml/BuckleScript called `list`. Lists' representation is internal, i.e. you **cannot**, on the JS side, read into its internal structure and manipulate/rely on it. As to why we don't compile list to JS array or vice-versa, it's because OCaml array and JS array share similar characteristics: mutable, similar read/write performance, etc. List, on the other hand, is immutable and has different access perf characteristics.

<!-- TODO: playground link -->
<!-- TODO: API docs revamp -->

