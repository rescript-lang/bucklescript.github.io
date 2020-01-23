---
title: Union types in BuckleScript
---

[Union types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types)

describesa value that can be one of several types. In JS, it is common to use the vertical bar (|) to separate each type, so `a | b | c`  is the type of a value that can be a number, a string, or a boolean.


Following [the last post](https://bucklescript.github.io/blog/2019/12/20/release-7-02) using the unboxed attribute, we can introduce such types as below:

```ocaml
type t = 
    | Any : 'a  -> t 
[@@unboxed]    
let a (v : a) = Any v
let b (v : b) = Any v
let c (v : c) = Any v
```

Note due to the `unboxed` attribute, `Any a` shares the same runtime representation as `a`, however, we need to make sure that user can only construct values of type `a`, `b` , or `c` into type `t`, by making use of the module system, we can achieve this:

```ocaml
module A_b_c : sig 
  type t 
  val a : a -> t 
  val b : b -> t 
  val c : c -> t   
end= struct 
type t = 
    | Any : 'a  -> t 
[@@unboxed]    
let a (v : a) = Any v
let b (v : b) = Any v
let c (v : c) = Any v
end
```

<!-- Union types are useful for modeling situations when values can overlap in the types they can take on.  -->
What happens when we need to know specifically whether we have a value of type `a`? This is a case by case issue, it depends on whether in the runtime encoding of `a`, `b` or `c` has some intersections. For some primitive types, it is easy enough to use `Js.typeof` to tell the difference between, e.g, `number` and `string`. 

Like [type guards in typescript](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types), we have to trust the user knowledge to differentiate between union types. However, such user level knowledge is isolated in a single module so that we can reason about its correctness locally.

Let's have a simple example, `number_or_string` first:

```ocaml
module Number_or_string : sig 
    type t 
    type case = 
        | Number of float 
        | String of string
    val number : float -> t 
    val string : string -> t 
    val classify : t -> case             
end = struct 
    type t = 
        | Any : 'a -> t 
    [@@unboxed]     
    type case = 
        | Number of float 
        | String of string
    let number (v : float) = Any v 
    let string (v : string) = Any v     
    let classify (A v : t) : case = 
        if Js.typeof v = "number" then Number (Obj.magic v  : float)
        else String (Obj.magic v : string)
end
```

Note here we use `Obj.magic` to do an unsafe type cast which relies on `Js.typeof`, in practice, people may use `instanceof`, below is an imaginative example:

```ocaml
module A_or_b : sig 
    type t 
    val a : a -> t 
    val b : b -> t 
    type case = 
        | A of a 
        | B of b 
    val classify : t -> case
end = struct
    type t = 
        | Any : 'a -> t
    [@@unboxed]   
    type case = 
        | A of a 
        | B of b 
    let a (v : a) = Any v 
    let b = (v : b) = Any b 
    let classify ( A v : t)  = 
        if [%raw{|function (a) { return  a instanceof globalThis.A}|}] v then A (Obj.magic v : a)
        else B (Obj.magic b)
end
```

Here we suppose `a` is of js class type `A`, we use `instanceof` to test it. Note we use some `unsafe` code locally, but as long as such code is carefully reviewed, it has  a safe boundary in the module level.


To conclude: thanks to `unboxed` attributes and the module language, we introduce a systematic way to convert values from `union types` (untagged union types) to `algebraic data types`(tagged union types), such conversion relies on the user level knowledge and has to be reviewed carefully. For some cases where `classify` is not needed, it can be done in a complete type safe way.
