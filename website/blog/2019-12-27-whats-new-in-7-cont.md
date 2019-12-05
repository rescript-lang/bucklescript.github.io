---
title: What's new in release 7 (cont)
---

[EDIT pre Dec. 27th: yes, we know the dateline is wrong :-) the actual publish date of this post is November 28th, but we're not changing the dateline because that would break the published URL of the post.]

The second dev release [7.0.0-dev.2](https://github.com/BuckleScript/bucklescript/pull/3995) is released for testing!

As we mentioned in the [previous post](https://bucklescript.github.io/blog/2019/11/18/whats-new-in-7), we compile records into js objects in this release. This makes the generated code more idiomatic, however, this is not enough to write idiomatic bindings to manipulate arbitrary js objects, since the key of js objects can be arbitrary which is not expressible in ReasonML syntax, so we support user level customization now, which makes idiomatic bindings really easy.

```reason
type entry = {
  [@bs.as "EXACT_MAPPING_TO_JS_LABEL"]
  x: int,
  [@bs.as "EXACT_2"]
  y: int,
  z: obj,
}
and obj = {
  [@bs.as "hello"]
  hi: int,
};

let f4 = ({x, y, z: {hi}}) => (x + y + hi) * 2;

```
```ocaml
type entry  = {
  x : int  ; [@bs.as "EXACT_MAPPING_TO_JS_LABEL"]
  y : int ; [@bs.as "EXACT_2"]
  z : obj
} 
and obj = {
  hi : int ; [@bs.as "hello"]  
}    

let f4  { x; y; z = {hi }} = 
  (x + y + hi) * 2
```

```js
function f4(param) {
  return (((param.EXACT_MAPPING_TO_JS_LABEL + param.EXACT_2 | 0) + param.z.hello | 0) << 1);
}
```

As you can see, you can manipulate js objects using Reason pattern match syntax, the generated 
code is highly efficient, more importantly, bindings to JS will be significantly simplifie.

Happy Hacking.
