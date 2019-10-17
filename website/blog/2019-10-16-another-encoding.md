---
title: Another way of encoding type identity
---

When we build some generic data structure, abstract over function is not enough. For example,  a type safe generic balanced AVL tree not only relies on the types of a comparison function, but also the identity of such function. Two balanced AVL trees which are initialized over same type of comparison function still can not be mixed.


```
module Eq1 = struct 
    let eq x  y = x = y
end 
```

```
module Eq2 = struct 
    let eq x y = x*x = y * y 
end
```
Take the two modules above for example, they have the same type, but we need a way to mark their identity so that data structures instantiated using them can not be mixed.

A traditional natural way is using functor.

```
module Make (Cmp : sig 
  type t 
  val eq : t -> t -> bool
end) = 
(struct 
  open Cmp
  type key = t
  type coll = key list 
  let empty = []
  let add  (y : coll) (e : key) = 
    if List.exists (fun x -> eq x e) y then
      y
    else      
      e::y
end  : sig 
  type key = Cmp.t 
  type coll
  val empty : coll
  val add : coll -> key -> coll
end )

module Ins1 = Make(struct
  type t = int 
  let eq x y = x = y 
end)
module Ins2 = Make(struct
  type t = int 
  let eq x y = x * x = y * y
end)
```
By marking `coll` as abstract type, when such functor is initialized,`Ins1.coll` and `Ins2.coll` are no longer the same.
```
let v = [Ins1.empty; Ins2.empty]
```

When mixing them together, we get a type error
```
File "xx.ml", line 31, characters 21-31:
Error: This expression has type Ins2.coll
       but an expression was expected of type Ins1.coll
```

There are some issues with such encoding: 

From runtime point of view, `Ins1` is initialized during runtime, its implementation is a big closure, which means even if you only use on function in `Ins1` module, all functions will be linked in.

From user point of view, people has to call `Ins1.add` and `Ins2.add` instead of calling `Ins.add`, this makes code less polymorphic.

Below is another encoding, note it is quite sophiscated that is recommended for library authors

```

module Cmp : sig 
  type ('a, 'id) cmp 
  val eq : ('a,'id) cmp -> 'a -> 'a -> bool
  module Make : functor ( M : 
                          sig type t 
                            val eq : t -> t -> bool 
                          end
                        ) -> sig 
    type identity
    val eq :  (M.t, identity) cmp
  end 

end = struct 
  type ('a, 'id) cmp = 'a -> 'a -> bool
  module Make (M: sig 
      type t 
      val eq : t -> t -> bool  
    end) = struct 
      type identity
      include M
  end 
  let eq cmp x y = cmp x y (* This could be inlined by using externals *)
end 

open Cmp 

module Coll : sig 
  type ('k, 'id) coll
  val empty : ('k, 'id) cmp -> ('k,'id) coll
  val add : ('k, 'id) coll -> 'k -> ('k,'id) coll 
end = struct 
  type ('k, 'id) coll = {
    eq :   ('k,'id) cmp;
    data :  'k list 
  }

  let empty (type t) (type identity) (eq : (t,identity) cmp) =
    {
      data = [];
      eq = eq 
    }
  let add (x : ('k,' id) coll) (y : 'k) =  
    if List.exists (fun a -> Cmp.eq x.eq a y) x.data then x else 
      {
        data = y:: x.data;

        eq = x.eq 
      }
end 

```

The key is the construction of Cmp modules, we create an abstract type `cmp` which is signed by a phantom type as identity.

The usage is as below:

```
module S0 = Make (struct 
  type t = int
    let eq x  y = x = y
  end)

module S1 = Make (struct 
  type t  = int
    let eq x y = x * x =  y * y 
  end)

let v0 = Coll.empty S0.eq 
let v1 = Coll.empty S1.eq 

let a0 = Coll.add v0 1 
let a1 = Coll.add v1 1 
```

We can make use of first class modules to get rid of functors from end users.

When we mix `a0` and `a1`, we will get a type error
```
File "xx0.ml", line 71, characters 13-15:
Error: This expression has type (int, S1.identity) Coll.coll
       but an expression was expected of type (int, S0.identity) Coll.coll
       Type S1.identity is not compatible with type S0.identity 
```       