---
id: object-record
title: Object & Record
---

JavaScript objects are used for so many purposes that if we had a single API for typing them, we'd likely end up with "this is an object that can take potentially many unknown fields with many unknown value types", which isn't very useful.

BS splits the many overloaded usage of JS objects into distinct categories, for better UX and perf.

## Object as Hash Map

Up until recently, where JS finally got proper Map support, objects have been used as a map. The characteristics of object-as-map are the following:

- contains values that are all of the same type
- might or might not add/remove arbitrary keys
- might or might not be accessed using a dynamic/computed key

If these points (especially the first one) describe your object usage, then look no further than using the [`Js.Dict`](https://bucklescript.github.io/bucklescript/api/Js.Dict.html) API! This is a thin layer of binding we've made for such situation. Under the hood, a `Js.Dict` is just an object, and the bindings are compiled away. No performance cost. Actually, **better** than no perf cost! See the Design Decisions below.

In this mode, you can do all the metaprogramming you're used to with JS objects: get all keys through `Js.Dict.keys`, get values through `Js.Dict.values`, etc.

## Object as Record

If your object:

- has a known number of fields
- might or might not contain values of heterogeneous types

Then you're really using it like a "record" in most languages. For example, think of the difference of use-case and intent between the object `{name: "John", age: 10, job: "CEO"}` and `{"John": 10, "Allison": 20, "Jimmy": 15}`.

The latter case would be the previous "hash map mode". The former case would be "record mode", treated here.

### Typing

Use the type `Js.t` that wraps an OCaml object type:

```ocaml
type person = <
  name: string;
  age: int;
  job: string
> Js.t

external john : person = "john"[@@bs.val ]
```

Reason syntax:

```reason
type person = Js.t({
  .
  name: string,
  age: int,
  job: string
});

[@bs.val] external john : person = "john";
```

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

Reason syntax:

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

Reason syntax:

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

Reason syntax:

```reason
/* wrong */
let talkTo = john##say("hey");

let jude = talkTo("jude");
let paul = talkTo("paul");
```

To ensure that folks don't accidentally curry a JavaScript method, we track every method call using `##` to make sure it's fully applied _immediately_. Under the hood, we effectively turn a function-looking call into a special `bs.meth` call (it only _looks_ like a function). Annotating the type definition of `say` with `bs.meth` completes this check.

### Creation

You can use `[%bs.obj putAnOCamlRecordHere]` DSL to create a JS object:

```ocaml
let bucklescript = [%bs.obj {
  info = {author = "Bob"}
}]

let name = bucklescript##info##author
```

Reason syntax:

```reason
let bucklescript = [%bs.obj {
  info: {author: "Bob"}
}];

let name = bucklescript##info##author;
```

Because object values are used often, Reason gives it a nicer sugar. `[%bs.obj {foo: 1}]` will format to `{. "foo": 1}`.

The created object will have an inferred type, no type declaration needed! The above example will infer as `< info: < author: string > Js.t > Js.t`. Reason syntax: `{. "info": {. "author": string}}`.

**Note**: since the value has its type inferred, **don't** accidentally do this:

```ocaml
type person = <age: string> Js.t
let jane = [%bs.obj {age = "hi"}]
```

Reason syntax:

```reason
type person = {. "age": string};
let jane = {"age": "hi"};
```

See what went wrong here? We've declared a `person` type, but `jane` is inferred as its own type, so `person` is ignored and no error happens! To give `jane` an explicit type, simply annotate it: `let jane: person = ...`. This will then error correctly.

#### Special Creation Function

OCaml's optional labeled function maps rather nicely to a JS object creation. We provide an alternative way of creating objects, `bs.obj`, that is convenient if said object contains optional fields:

```ocaml
type t
external make_config : hi:int -> ?lo:int -> unit -> t = "" [@@bs.obj]

let c1 = make_config ~hi:3 ()
let c2 = make_config ~lo:2 ~hi:3 ()
```

Reason syntax:

```reason
type t;
[@bs.obj] external make_config : (~hi: int, ~lo: int=?, unit) => t = "";

let c1 = make_config(~hi=3, ());
let c2 = make_config(~lo=2, ~hi=3, ());
```

Output:

```js
var c1 = {hi : 3};
var c2 = {hi : 3 , lo: 2};
```

_The final `unit` is there to indicate that you've finished applying optional arguments. More info [here](https://reasonml.github.io/guide/language/function#optional-labeled-arguments)_.

For extra hacking, you can make the returned type `t` un-abstract, aka `type t = <hi: int, lo: int Js.nullable> Js.t`.

### Invalid Field Names

Sometimes, you might be binding to JavaScript object fields that start with capital letters or use reserved words. The latter is invalid and the former is reserved for module and variant names. To circumvent this, we support object label mangling/translation:

```ocaml
stream##_open
stream##_MAX_LENGTH
```

Output:

```js
stream.open;
stream.MAX_LENGTH;
```

**Double check your JS output** to make sure your name mangling worked.

If your key contains hyphens... you'll have to use the next method.

<!-- TODO: playground link -->

### Js Object <-> OCaml Record conversion

If you don't want to work with `Js.t` objects and want to use idiomatic OCaml/Reason records, we provide automatic generation of helpers that convert between a `Js.t` object and a corresponding record type. See the section on [Generate Helpers (Deriving)](generate-helpers-deriving.md).

## Object as Dynamic Record

When The two above modes of binding to objects fail, you can always fall back to this one. And sometimes this the **preferable** way of binding to objects, because it:

- deals with objects with potentially arbitrary shapes
- allows heterogeneous values
- allows hyphen in object keys



bs.get_index
