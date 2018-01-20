---
title: Cheatsheet
---

The next few sections will cover these in detail. Feel free to skip this one if nothing makes sense yet!

## Raw JS

```ocaml
let add = [%raw "a + b"]
[%%raw "var a = 1"]
```

Reason syntax:

```reason
let add = [%raw "a + b"];
[%%raw "var a = 1"];
```

## String Unicode & Interpolation

```ocaml
Js.log {js|你好，
世界|js}

let world = "world"
let helloWorld = {j|hello, $world|j}
```

Reason syntax:

```reason
Js.log({js|你好，
世界|js});

let world = "world";
let helloWorld = {j|hello, $world|j};
```

## Boolean

Directly returning a `bool`, letting the compiler cast from `Js.boolean` to `bool` under the hood.

```ocaml
external isStudent: string -> bool = "isStudent" [@@bs.val]
```

Reason syntax:

```reason
[@bs.val] external isStudent : string => bool = "isStudent";
```

`Js.to_bool`, `Js.Boolean.to_js_boolean`.

## Global Value

```ocaml
external setTimeout : (unit -> unit) -> int -> float = "setTimeout" [@@bs.val]
```

Reason syntax:

```reason
[@bs.val] external setTimeout : (unit => unit, int) => float = "setTimeout";
```

## Global Module

```ocaml
external random: unit -> float = "random" [@@bs.val][@@bs.scope "Math"]
let someNumber = random ()

external length: int = "length" [@@bs.val][@@bs.scope "window", "DocumentType", "toString"]
```

Reason syntax:

```reason
[@bs.val] [@bs.scope "Math"]
external random : unit => float = "random";
let someNumber = random();

[@bs.val] [@bs.scope ("window", "DocumentType", "toString")]
external length : int = "length";
```

## Nullable

```ocaml
let jsNull = Js.Nullable.null
let jsUndefined = Js.Nullable.undefined

let result1: string Js.Nullable.t = Js.Nullable.return "hello"
let result2: int Js.Nullable.t  = Js.Nullable.from_opt (Some 10)
let result3: int option  = Js.Nullable.to_opt (Js.Nullable.return 10)
```

Reason syntax:

```reason
let jsNull = Js.Nullable.null;
let jsUndefined = Js.Nullable.undefined;

let result1: Js.Nullable.t(string) = Js.Nullable.return("hello");
let result2: Js.Nullable.t(int) = Js.Nullable.from_opt(Some(10));
let result3: option(int) = Js.Nullable.to_opt(Js.Nullable.return(10));
```

Directly convert from `Js.Nullable.t` to `option`:

```ocaml
external getElementById : string -> element option = "getElementById" [@@bs.scope "document"][@@bs.return nullable]
```

Reason syntax:

```reason
[@bs.scope "document"] [@bs.return nullable]
external getElementById : string => option(element) = "getElementById";
```

## Object

### Hash Map Mode

```ocaml
let myMap = Js.Dict.empty ()
let _ = Js.Dict.set myMap "Allison" 10
```

Reason syntax:

```reason
let myMap = Js.Dict.empty();
Js.Dict.set(myMap, "Allison", 10);
```

### Record Mode

```ocaml
type person = <
  name: string;
  age: int;
  job: string [@bs.set];
  getNickname: unit -> string [@bs.meth]
> Js.t

external john : person = "john" [@@bs.val]
let age = john##age
let _ = john##job #= "Accountant"
let nick = john##getNickname ()
```

Reason syntax:

```reason
type person = {
  .
  "name": string,
  "age": int,
  [@bs.set] "job" : string,
  [@bs.meth] "getNickname" : unit => string
};

[@bs.val] external john : person = "john";
let age = john##age;
john##job#="Accountant";
let nick = john##getNickname();
```

### Creation

```ocaml
let bucklescript = [%bs.obj {
  info = {author = "Bob"}
}]

let name = bucklescript##info##author
```

Reason syntax:

```reason
let bucklescript = {
  "info": {
    author: "Bob"
  }
};

let name = bucklescript##info##author;
```

```ocaml
external makeConfig :
  high:int ->
  ?low:int ->
  name:(_ [@bs.as {json|false|json}]) ->
  unit ->
  _ = "" [@@bs.obj]

let c1 = makeConfig ~high:3 ()
let low: int Js.undefined = c1##low
```

Reason syntax:

```reason
[@bs.obj]
external makeConfig : (
  ~high: int,
  ~low: int=?,
  ~name: [@bs.as {json|false|json}] _, unit
) => _ = "";

let c1 = makeConfig(~high=3, ());
let low: Js.undefined(int) = c1##low;
```

### Name Mangling

```ocaml
stream##_open (* open *)
stream##_MAX_LENGTH (* MAX_LENGTH *)
```

Reason syntax:

```reason
stream##_open /* open */
stream##_MAX_LENGTH /* MAX_LENGTH */
```

### Getter/Setter

```ocaml
type t
external get : t -> int -> int = "" [@@bs.get_index]

type textarea
external setName : textarea -> string -> unit = "name" [@@bs.set]
```

Reason syntax:

```reason
type t;
[@bs.get_index] external get : (t, int) => int = "";

type textarea;
[@bs.set] external setName : (textarea, string) => unit = "name";
```

### New Instance

```ocaml
type t
external createDate : unit -> t = "Date" [@@bs.new]
```

Reason syntax:

```reason
type t;
[@bs.new] external createDate : unit => t = "Date";
```

## Function

### Method & Chaining

```ocaml
external getElementById : document -> string -> Dom.element = "getElementById" [@@bs.send]

external map : ('a -> 'b) -> 'b array = "" [@@bs.send.pipe: 'a array]
```

Reason syntax:

```reason
[@bs.send] external getElementById : (document, string) => Dom.element = "getElementById";

[@bs.send.pipe : array('a)]
external map : ('a => 'b) => array('b) = "";
```

### Variadic

```ocaml
external join : string array -> string = "" [@@bs.module "path"] [@@bs.splice]
```

Reason syntax:

```reason
[@bs.module "path"] [@bs.splice]
external join : array(string) => string = "";
```

### Polymorphic Function

```ocaml
external drawCat: unit -> unit = "draw" [@@bs.module "Drawing"]
external drawDog: giveName:string -> unit = "draw" [@@bs.module "Drawing"]
```

Reason syntax:

```reason
[@bs.module "Drawing"] external drawCat : unit => unit = "draw";
[@bs.module "Drawing"] external drawDog : (~giveName: string) => unit = "draw";
```

```ocaml
external padLeft :
  string
  -> ([ `Str of string
      | `Int of int
      ] [@bs.unwrap])
  -> string
  = "" [@@bs.val]

let _ = padLeft "Hello World" (`Int 4)
```

Reason syntax:

```reason
[@bs.val] external padLeft : (
  string,
  [@bs.unwrap] [
    | `Str(string)
    | `Int(int)
  ]
) => string = "";

padLeft("Hello World", `Int(4));
```

### Curry/Uncurry

```ocaml
let add = fun [@bs] x y z -> x + y + z
let six = (add 1 2 3) [@bs]
```

Reason syntax:

```reason
let add = [@bs] ((x, y, z) => x + y + z);
let six = [@bs] add(1, 2, 3);
```

## Module

```ocaml
external dirname: string -> string = "dirname" [@@bs.module "path"]
```

Reason syntax:

```reason
[@bs.module "path"] external dirname : string => string = "dirname";
```

### Import Default

```ocaml
external leftPad: string -> int -> string = "./leftPad" [@@bs.module]
```

Reason syntax:

```reason
[@bs.module] external leftPad : (string, int) => string = "./leftPad";
```

Import ES6 default compiled from Babel:

```ocaml
external studentName: string = "default" [@@bs.module "./student"]
```

Reason syntax:

```reason
[@bs.module "./student"] external studentName : string = "default";
```

### Export ES6 default

```ocaml
let default = "Bob"
```

Reason syntax:

```reason
let default = "Bob";
```

## Identity External

Final escape hatch converter. Do not abuse.

```ocaml
external myShadyConversion : foo -> bar = "%identity"
```

Reason syntax:

```reason
external myShadyConversion : foo => bar = "%identity";
```
