---
title: Object 2
---

There's an alternative of binding to JavaScript objects, if the previous section's `bs.deriving abstract` doesn't suit your needs:

- You don't want to declare a type beforehand
- You want your object to be "structural", e.g. your function wants to accept "any object with the field `age`, not just a particular object whose type definition is declared above".

> Reminder of the above distinction of record vs object [here](https://reasonml.github.io/docs/en/record#record-types-are-found-by-field-name).

This section describes how BuckleScript uses OCaml's object facility to achieve this other way of binding and compiling to JavaScript objects.

## Pitfall

First, note that we **cannot** use the ordinary OCaml/Reason object type, like this:

```ocaml
type person = <
  name: string;
  age: int;
  job: string
>
```

```reason
type person = {
  .
  name: string,
  age: int,
  job: string
};
```

You can still use this feature, but this OCaml/Reason object type does **not** compile to a clean JavaScript object! Unfortunately, this is because OCaml/Reason objects work a bit too differently from JS objects.

## Actual Solution

BuckleScript wraps the regular OCaml/Reason object type with `Js.t`, in order to control and track a **subset** of operations and types that we know would compile cleanly to JavaScript. This is how it looks like:

```ocaml
type person = <
  name: string;
  age: int;
  job: string
> Js.t

external john : person = "john" [@@bs.val]
```

```reason
type person = Js.t({
  .
  name: string,
  age: int,
  job: string
});

[@bs.val] external john : person = "john";
```

**From now on**, we'll call the BuckleScript interop object "`Js.t` object", to disambiguate it with normal object and JS object.

Because object types are used often, Reason gives it a nicer sugar. `Js.t({. name: string})` will format to `{. "name": string}`.

### Accessors

#### Read

To access a field, use `##`: `let johnName = john##name`.

#### Write

To modify a field, you need to first mark a field as mutable. By default, the `Js.t` object type is immutable.

```ocaml
type person = < age : int [@bs.set] > Js.t
external john: person = "john" [@@bs.val]

let _ = john##age #= 99
```

```reason
type person = {. [@bs.set] "age": int};
[@bs.val] external john : person = "john";

john##age #= 99;
```

**Note**: you can't use dynamic/computed keys in this paradigm.

#### Call

To call a method of a field, mark the function signature as `[@bs.meth]`:

```ocaml
type person = < say : string -> string -> unit [@bs.meth] > Js.t
external john: person = "john" [@@bs.val]

let _ = john##say "hey" "jude"
```

```reason
type person = {. [@bs.meth] "say": (string, string) => unit};
[@bs.val] external john : person = "john";

john##say("hey", "jude");
```

**Why `[bs.meth]`**? Why not just call it directly? A JS object might carry around a reference to `this`, and infamously, what `this` points to can change. OCaml/BuckleScript functions are curried by default; this means that if you intentionally curry `say`, by the time you fully apply it, the `this` context could be wrong:

```ocaml
(* wrong *)
let talkTo = john##say("hey")

let jude = talkTo "jude"
let paul = talkTo "paul"
```

```reason
/* wrong */
let talkTo = john##say("hey");

let jude = talkTo("jude");
let paul = talkTo("paul");
```

To ensure that folks don't accidentally curry a JavaScript method, we track every method call using `##` to make sure it's fully applied _immediately_. Under the hood, we effectively turn a function-looking call into a special `bs.meth` call (it only _looks_ like a function). Annotating the type definition of `say` with `bs.meth` completes this check.

### Creation

You can use `[%bs.obj putAnOCamlRecordHere]` DSL to create a `Js.t` object:

```ocaml
let bucklescript = [%bs.obj {
  info = {author = "Bob"}
}]

let name = bucklescript##info##author
```

```reason
let bucklescript = [%bs.obj {
  info: {author: "Bob"}
}];

let name = bucklescript##info##author;
```

Because object values are used often, Reason gives it a nicer sugar. `[%bs.obj {foo: 1}]` will format to `{"foo": 1}`.

**Note**: there's no syntax sugar for creating an empty object in OCaml nor Reason (aka this doesn't work: `[@bs.obj {}]`. Please use `Js.Obj.empty()` for that purpose.

The created object will have an inferred type, no type declaration needed! The above example will infer as:

```ocaml
< info: < author: string > Js.t > Js.t
```

```reason
{. "info": {. "author": string}}
```

**Note**: since the value has its type inferred, **don't** accidentally do this:

```ocaml
type person = <age: int> Js.t
let jane = [%bs.obj {age = "hi"}]
```

```reason
type person = {. "age": int};
let jane = {"age": "hi"};
```

See what went wrong here? We've declared a `person` type, but `jane` is inferred as its own type, so `person` is ignored and no error happens! To give `jane` an explicit type, simply annotate it: `let jane: person = ...`. This will then error correctly.
