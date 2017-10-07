\#\# Runtime representation

Below is a description of how OCaml values are encoded in JavaScript,
the **internal** description means **users should not rely on its actual
encoding (and it is subject to change)**. We recommend that you write
setter/getter functions to manipulate safely OCaml values from
JavaScript.

For example, users should not rely on how OCaml `list` is encoded in
JavaScript; instead, the OCaml stdlib provides three functions:
`List.cons`, `List.hd` and `List.tl`. JavaScript code should only rely
on those three functions.

\# Simple OCaml type

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<thead>
<tr class="header">
<th>ocaml type</th>
<th>JavaScript type</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>int</p></td>
<td><p>number</p></td>
</tr>
<tr class="even">
<td><p>nativeint</p></td>
<td><p>number</p></td>
</tr>
<tr class="odd">
<td><p>int32</p></td>
<td><p>number</p></td>
</tr>
<tr class="even">
<td><p>float</p></td>
<td><p>number</p></td>
</tr>
<tr class="odd">
<td><p>bool</p></td>
<td>number
<ul>
<li><p>true → 1</p></li>
<li><p>false → 0</p></li>
</ul></td>
</tr>
<tr class="even">
<td><p>int64</p></td>
<td><p>Array of size two numbers <code>[hi,lo]</code>. <code>hi</code> is signed while <code>lo</code> is unsigned</p></td>
</tr>
<tr class="odd">
<td><p>char</p></td>
<td>number
<p>for example:</p>
<ul>
<li><p><em>a</em> → <code>97</code></p></li>
</ul></td>
</tr>
<tr class="even">
<td><p>string</p></td>
<td><p>string</p></td>
</tr>
<tr class="odd">
<td><p>bytes</p></td>
<td>number array
<blockquote>
<p><strong>Note</strong></p>
<p>We might encode it as buffer in NodeJS.</p>
</blockquote></td>
</tr>
<tr class="even">
<td><p>'a array</p></td>
<td><p>Array</p></td>
</tr>
<tr class="odd">
<td><p>record</p></td>
<td>Array *internal*
<p>For instance:</p>
<pre class="ocaml"><code>type t = { x : int; y : int }
let v = {x = 1; y = 2}</code></pre>
<p>Output:</p>
<pre class="js"><code>var v = [1,2]</code></pre></td>
</tr>
<tr class="even">
<td><p>tuple</p></td>
<td>Array
<p>For example:</p>
<ul>
<li><p>(3,4) → [3,4]</p></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>``'a option`</p></td>
<td>*internal*
<p>For example:</p>
<ul>
<li><p><code>None</code> → <code>0</code></p></li>
<li><p><code>Some a</code> → <code>[a]</code></p></li>
</ul></td>
</tr>
<tr class="even">
<td><p>list</p></td>
<td>*internal*
<p>For example:</p>
<ul>
<li><p><code>[]</code> → <code>0</code></p></li>
<li><p><code>x::y</code> → <code>[x,y]</code></p></li>
<li><p><code>1::2::[3]</code> → <code>[ 1, [ 2, [ 3, 0 ] ] ]</code></p></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Variant</p></td>
<td>*internal* (subject to change)
<p>Simple Variants: (Variants with only one non-nullary constructor)</p>
<pre class="ocaml"><code>type tree =
  | Leaf
  | Node of int * tree * tree
(* Leaf --&gt; 0 *)
(* Node(a,b,c) --&gt; [a,b,c]*)</code></pre>
<p>Complex Variants: (Variants with more than one non-nullary constructor)</p>
<pre class="ocaml"><code>type u =
     | A of string
     | B of int
(* A a --&gt; [a].tag=0 -- tag 0 assignment is optional *)
(* B b --&gt; [b].tag=1 *)</code></pre></td>
</tr>
<tr class="even">
<td><p>Polymorphic variant</p></td>
<td>*internal*
<pre class="ocaml"><code>`a (* 97 *)
`a 1 2 (* [97, [1,2] ]*)</code></pre></td>
</tr>
<tr class="odd">
<td><p>exception</p></td>
<td><p><strong>internal</strong></p></td>
</tr>
<tr class="even">
<td><p>extension</p></td>
<td><p><strong>internal</strong></p></td>
</tr>
<tr class="odd">
<td><p>object</p></td>
<td><p><strong>internal</strong></p></td>
</tr>
<tr class="even">
<td><p><code>Js.boolean</code></p></td>
<td>boolean
<p>For example:</p>
<ul>
<li><p>Js.true_ → true</p></li>
<li><p>Js.false_ → false</p></li>
</ul>
<p><strong>Js module.</strong></p>
<pre class="ocaml"><code>type boolean
val to_bool: boolean -&gt; bool</code></pre>
<p><strong><a href="../api/Js.Boolean.html">Js.Boolean</a> module.</strong></p>
<pre><code>val to_js_boolean: bool -&gt; Js.boolean</code></pre></td>
</tr>
<tr class="odd">
<td><p><code>'a Js.Null.t</code></p></td>
<td>Either `'a` or `null`. `Js.Null.empty` represents `null` too.
<p><strong><a href="../api/Js.Null.html">Js.Null</a> module.</strong></p>
<pre class="ocaml"><code>val to_opt : &#39;a t -&gt; &#39;a option
val from_opt : &#39;a option -&gt; &#39;a t
val return : &#39;a -&gt; &#39;a t
val test : &#39;a t -&gt; bool</code></pre></td>
</tr>
<tr class="even">
<td><p><code>'a Js.Undefined.t</code></p></td>
<td>Either `'a` or `undefined`. Same operations as `'a Js.Null.t`. `Js.Undefined.empty` represents `undefined` too.</td>
</tr>
<tr class="odd">
<td><p><code>'a Js.Null_undefined.t</code></p></td>
<td>Either `'a`, `null` or `undefined`. Same operations as `'a Js.Null.t`.
<p><code>Js.Null_undefined.undefined</code> represents <code>undefined</code>, <code>Js.Null_undefined.null</code> represents <code>null</code>.</p>
<p>This module’s null tests check for both <code>null</code> and <code>undefined</code>; if you know the value’s only ever going to be <code>null</code> and not undefined, use <code>Js.Null</code> instead. Likewise for <code>Js.Undefined</code>.</p></td>
</tr>
</tbody>
</table>

> **Note**
>
> `Js.to_opt` is optimized when the `option` is not escaped

> **Note**
>
> In the future, we will have a *debug* mode, in which the corresponding
> js encoding will be instrumented with more information

As we clarified before, the internal representation should not be relied
upon. We are working to provide a ppx extension as below:

    type t =
      | A
      | B of int * int
      | C of int * int
      | D [@@bs.deriving{export}]

So that it will a automatically provide `constructing` and `destructing`
functions:

    val a : t
    val b : int -> int -> t
    val c : int -> int -> t
    val d : int

    val a_of_t : t -> bool
    val d_of_t : t -> bool
    val b_of_t : t -> (int * int ) Js.Null.t
    val c_of_t : t -> (int * int ) Js.Null.t
