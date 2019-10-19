---
title: Another way of encoding type identity for BuckleScript libraries without using big functor
---

Note this article is for library authors, it has something in depth which is not necessary for people who use BuckleScript at daily work.

When we build some generic data structure, abstract over function is not enough. For example,  a type safe generic balanced AVL tree not only relies on the types of a comparison function, but also the identity of such function. Two balanced AVL trees which are initialized over same type of comparison function still can not be mixed.


```reason
module Eq1 = {
  let eq = (x, y) => x == y;
};
```

```ocaml
module Eq1 = struct 
  let eq x y = x = y
end 
```

```reason
module Eq2 = {
  let eq = (x, y) => x == y;
};
```

```ocaml
module Eq2 = struct 
  let eq x y = x * x = y * y 
end
```

Take the two modules above for example, they have the same type, but we need a way to mark their identity so that data structures instantiated using them can not be mixed.

A traditional way is using functor:

```ocaml
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
end : sig 
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

```reason
module Make = (
  Cmp: {
    type t;
    let eq: (t, t) => bool;
  }) : {
 type key = Cmp.t;
 type coll;
 let empty: coll;
 let add: (coll, key) => coll;
} => {
  open Cmp;
  type key = t;
  type coll = list(key);
  let empty = [];
  let add = (y: coll, e: key) =>
    if (List.exists(x => eq(x, e), y)) {
      y;
    } else {
      [e, ...y];
    };
};

module Ins1 = Make({
  type t = int;
  let eq = (x, y) => x == y;
});
module Ins2 = Make({
  type t = int;
  let eq = (x, y) => x * x == y * y;
});
```
By marking `coll` as abstract type, when such functor is initialized,`Ins1.coll` and `Ins2.coll` are no longer the same.

```ocaml
let v = [Ins1.empty; Ins2.empty]
```
```reason
let v = [Ins1.empty, Ins2.empty];
```

When mixing them together, we get a type error
```
File ..., line 31, characters 21-31:
Error: This expression has type Ins2.coll
       but an expression was expected of type Ins1.coll
```

There are some issues with such encoding: 

- From runtime point of view, `Ins1` is initialized during runtime, its implementation is a *big closure*, which means even if you only use on function in `Ins1` module, all functions will be linked in.

- From user point of view, people has to call `Ins1.add` and `Ins2.add` instead of calling `Ins.add`, this makes code less polymorphic.

Now we introduce another encoding, note it is quite sophiscated that is recommended only for library authors

```reason
module Cmp: {
  type cmp('a, 'id);
  let eq: (cmp('a, 'id), 'a, 'a) => bool;
  module Make: (
    M: {
       type t;
       let eq: (t, t) => bool;
     }
  ) => {
    type identity;
    let eq: cmp(M.t, identity);
  };
} = {
  type cmp('a, 'id) = ('a, 'a) => bool;
  module Make = (
    M: {
     type t;
     let eq: (t, t) => bool;
    }
  ) => {
    type identity;
    include M;
  };
  let eq = (cmp, x, y) => cmp(x, y); /* This could be inlined by using externals */
};

open Cmp;

module Coll: {
  type coll('k, 'id);
  let empty: cmp('k, 'id) => coll('k, 'id);
  let add: (coll('k, 'id), 'k) => coll('k, 'id);
} = {
  type coll('k, 'id) = {
    eq: cmp('k, 'id),
    data: list('k),
  };

  let empty = (type t, type identity, eq: cmp(t, identity)) => {
    data: [],
    eq,
  };
  let add = (x: coll('k, 'id), y: 'k) =>
    if (List.exists(a => Cmp.eq(x.eq, a, y), x.data)) {
      x;
    } else {
      {
        data: [y, ...x.data],
        eq: x.eq,
      };
    };
};
```


```ocaml
module Cmp : sig 
  type ('a, 'id) cmp 
  val eq : ('a,'id) cmp -> 'a -> 'a -> bool
  module Make : functor (M : 
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

  let empty (type t) (type identity) (eq : (t,identity) cmp) = {
    data = [];
    eq = eq 
  }

  let add (x : ('k,' id) coll) (y : 'k) =  
    if List.exists (fun a -> Cmp.eq x.eq a y) x.data then x
    else {
      data = y:: x.data;
      eq = x.eq 
    }
end 

```

The key is the construction of Cmp modules, we create an abstract type `cmp` which is signed by a phantom type as its identity, it is unique whenever user create it by calling `Make` functor. Here we are still using functor, but it is small functor.

The usage is as below:

```ocaml
module S0 = Make (struct 
  type t = int
    let eq x y = x = y
  end)

module S1 = Make (struct 
  type t  = int
    let eq x y = x * x = y * y 
  end)

let v0 = Coll.empty S0.eq 
let v1 = Coll.empty S1.eq 

let a0 = Coll.add v0 1 
let a1 = Coll.add v1 1 
```
```reason
module S0 = Make({
  type t = int;
  let eq = (x, y) => x == y;
});

module S1 = Make({
  type t = int;
  let eq = (x, y) => x * x == y * y;
});

let v0 = Coll.empty(S0.eq);
let v1 = Coll.empty(S1.eq);

let a0 = Coll.add(v0, 1);
let a1 = Coll.add(v1, 1);
```

In practice, we can make use of first class modules to get rid of functors from end users, which is saved for readers.

When we mix `a0` and `a1`, we will get a type error
```
File ..., line 71, characters 13-15:
Error: This expression has type (int, S1.identity) Coll.coll
       but an expression was expected of type (int, S0.identity) Coll.coll
       Type S1.identity is not compatible with type S0.identity 
```       

As you read here, by using such encoding, the data structure is more generalized from user point of view. The generated JS code is not in a big closure so that it can be dead code eliminated better.

This style is extensively used in Belt encoding, we  encourage you to have a look at its implementation for better ideas.


