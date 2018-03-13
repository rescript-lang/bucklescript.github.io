---
title: Object
---

JavaScript objects are used for so many purposes that if we had a single API for typing them, we'd likely end up with "this is an object that can take potentially many unknown fields with many unknown value types", which isn't very useful.

BS splits the many overloaded usage of JS objects into distinct categories, for better UX and perf.

## Object as Hash Map

Up until recently, where JS finally got proper Map support, objects have been used as a map. The characteristics of object-as-map are the following:

- contains values that are all of the same type
- might or might not add/remove arbitrary keys
- might or might not be accessed using a dynamic/computed key

If these points (especially the first one) describe your object usage, then look no further than using the [`Js.Dict`](https://bucklescript.github.io/bucklescript/api/Js.Dict.html) API! This is a thin wrapper we've made for such situation. Under the hood, a `Js.Dict` is just an object, and the whole API is erased after compilation. No performance cost. Actually, **better** than no perf cost! See the Design Decisions below.

In this mode, you can do all the metaprogramming you're used to with JS objects: get all keys through `Js.Dict.keys`, get values through `Js.Dict.values`, etc.

### Example

```ocaml
let myMap = Js.Dict.empty ()
let _ = Js.Dict.set myMap "Allison" 10
```

Reason syntax:

```reason
let myMap = Js.Dict.empty();
Js.Dict.set(myMap, "Allison", 10);
```

Output:

```js
var myMap = { };
myMap["Allison"] = 10;
```

## Object as "Record"

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

external john : person = "john" [@@bs.val]
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

Because object values are used often, Reason gives it a nicer sugar. `[%bs.obj {foo: 1}]` will format to `{"foo": 1}`.

**Note**: there's no syntax sugar for creating an empty object in OCaml nor Reason (aka this doesn't work: `[@bs.obj {}]`. Please use `Js.Obj.empty()` for that purpose.

The created object will have an inferred type, no type declaration needed! The above example will infer as `< info: < author: string > Js.t > Js.t`. Reason syntax: `{. "info": {. "author": string}}`.

**Note**: since the value has its type inferred, **don't** accidentally do this:

```ocaml
type person = <age: int> Js.t
let jane = [%bs.obj {age = "hi"}]
```

Reason syntax:

```reason
type person = {. "age": int};
let jane = {"age": "hi"};
```

See what went wrong here? We've declared a `person` type, but `jane` is inferred as its own type, so `person` is ignored and no error happens! To give `jane` an explicit type, simply annotate it: `let jane: person = ...`. This will then error correctly.

#### Special Creation Function

OCaml's optional labeled function maps rather nicely to a JS object creation. We provide an alternative way of creating objects, `bs.obj`, that is convenient if said object contains optional fields:

```ocaml
external makeConfig : high:int -> ?low:int -> unit -> _ = "" [@@bs.obj]

let c1 = makeConfig ~high:3 ()
let c2 = makeConfig ~low:2 ~high:3 ()

(* access them as Js.t objects! *)
let high: int = c1##high
let low: int Js.undefined = c1##low
```

Reason syntax:

```reason
[@bs.obj] external makeConfig : (~high: int, ~low: int=?, unit) => _ = "";

let c1 = makeConfig(~high=3, ());
let c2 = makeConfig(~low=2, ~high=3, ());

/* access them as Js.t objects! */
let high: int = c1##high;
let low: Js.undefined(int) = c1##low;
```

Output:

```js
var c1 = {high: 3};
var c2 = {high: 3, low: 2};
var high = c1.high;
var low = c1.low;
```

**Note**:

- Marking the return value as `_` will infer a `Js.t` object of the expected shape!

- The final `unit` is there to indicate that you've finished applying optional arguments. More info [here](https://reasonml.github.io/docs/en/function.html#labeled-arguments).

You can also attach constant data unto an object using `[@bs.as]`:

```ocaml
external makeIOConfig :
  stdio:(_ [@bs.as "inherit"]) ->
  cwd:string ->
  detached:(_ [@bs.as {json|true|json}]) ->
  unit ->
  _ = "" [@@bs.obj]

let config = makeIOConfig ~cwd:"." ()
```

Reason syntax:

```reason
[@bs.obj]
external makeIOConfig : (
  ~stdio: [@bs.as "inherit"] _,
  ~cwd: string,
  ~detached: [@bs.as {json|true|json}] _,
  unit
) => _ = "";

let config = makeIOConfig(~cwd=".", ());
```

Output:

```js
var config = {
  stdio: "inherit",
  cwd: ".",
  detached: true
};
```

### Name mangling

#### Invalid field names

Sometimes, you might encounter JavaScript object fields that start with capital letters or use reserved words. The latter is invalid and the former is reserved for module and variant names. To circumvent this, we support object label mangling/translation:

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

**If your key contains hyphens**, you'll have to use it as a dynamic record, described later.

#### Ad-hoc Polymorphism

Another form of name mangling is also supported, where a double underscore (`__`) can be used add a disambiguating identifier which will be removed in the generated JS.

```ocaml
f##draw__int 3 4
f##draw__float 3.2 4.5
```

Reason syntax:

```reason
f##draw__int(3, 4);
f##draw__float(3.2, 4.5);
```

Output:

```js
f.draw(3, 4);
f.draw(3.2, 4.5);
```

This can be useful in rare circumstances, but is generally not recommended since it produces non-idiomatic identifiers and is not very intuitive. Prefer instead to implement the object as a dynamic record (described below), or define an abstract untagged union type to encapsulate values of either type before passing them to or from JavaScript.

### Js Object <-> OCaml Record conversion

If you don't want to work with `Js.t` objects and want to use idiomatic OCaml/Reason records, we provide automatic generation of helpers that convert between a `Js.t` object and a corresponding record type. See the section on [Generate Converters & Helpers](generate-converters-accessors.md).

<!-- TODO: playground link -->

## Object as Dynamic Record

When The two above modes of talking to JS objects fail, you can always fall back to this one. And sometimes this the **preferable** way of talking to JS objects, because it:

- deals with objects with potentially arbitrary shapes
- allows heterogeneous values
- **allows hyphen and other symbols in object keys**

```ocaml
type t
external create : int -> t = "Int32Array" [@@bs.new] (* bs.new is documented in the class section *)
external get : t -> int -> int = "" [@@bs.get_index]
external set : t -> int -> int -> unit = "" [@@bs.set_index]

let i32arr = (create 3)
let _ = set i32arr 0 42
let _ = Js.log (get i32arr 0)
```

Reason syntax:

```reason
type t;
[@bs.new] external create : int => t = "Int32Array"; /* bs.new is documented in the class section */
[@bs.get_index] external get : (t, int) => int = "";
[@bs.set_index] external set : (t, int, int) => unit = "";

let i32arr = create(3);
set(i32arr, 0, 42);
Js.log(get(i32arr, 0));
```

Albeit the names are called `get_index` and `set_index`, it's really dynamic access of objects fields and/or arrays.

Output:

```js
var i32arr = new Int32Array(3);
i32arr[0] = 42;
console.log(i32arr[0]);
```

### Specific Getter/Setter

```ocaml
type textarea
external setName : textarea -> string -> unit = "name" [@@bs.set]
external getName : textarea -> string = "name" [@@bs.get]

external myTextArea: textarea = "" [@@bs.val]
let _ = setName myTextArea "asd"
```

Reason syntax:

```reason
type textarea;
[@bs.set] external setName : (textarea, string) => unit = "name";
[@bs.get] external getName : textarea => string = "name";

[@bs.val] external myTextArea : textarea = "";
setName(myTextArea, "asd");
```

Output:

```js
myTextArea.name = "asd";
```

There's also a trick with object methods and method chaining in the next function section.

## Conclusion

All these tricks to bind to JS objects might be overwhelming; don't worry, you can just pick whatever you need as you go. But hopefully you can see that there's almost always a way to bind to your favorite JS library with no cost!
