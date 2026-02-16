---
title: "Bitmap in Rust"
description: "Walk-through implementation of a simple bitmap in Rust."
pubDatetime: 2025-01-12T20:00:00+1
tags:
  - "index"
  - "bitmap"
  - "rust"
---

## Table of contents

## Introduction

In the [last blog post](./indices-and-bitmaps), we took a look at database indices. Bitmaps are one of the many data structures that can be
used to power such an index.

Time to implement a bitmap ourselves. I use Rust to do this, though any other programming language could be used. The full code can be found
at https://github.com/christianschleifer/bitmaps-in-rust.

## Requirements

Be it in a hobby project like this, or a project at work, it's often a good idea to state the requirements for the solution one is building
first thing. We'll focus on the functional requirements, which define the behavior our bitmap should support.

Our bitmap should allow

- setting the bit at index `i` (to `1`)
- checking whether the bit at index `i` has been set (to `1`)
- getting the union between two bitmaps

We can also use Rust's type system to express these requirements. Let's focus on the first two requirements first.

```rust
// src/lib.rs

pub trait Bitmap {
    fn set(&mut self, index: u32);

    fn get(&self, index: u32) -> bool;
}
```

## SimpleBitmap

The `Bitmap` trait just specifies the functionality that a bitmap must offer. Now let's implement the `Bitmap` trait. We'll start with a
trivial implementation. This will not be a production-read bitmap. There is a myriad of things that could be improved upon. To explain the
concepts, it can be better to keep things simple, though.

Firstly, we need a way to store an array of bits. Rust does not provide a bit-sized data type. While we could use the 8-bit `byte` data
type, I'll opt for the 32-bit `u32` data type. Instead of a fixed-size array, I'll use the dynamically sized
[Vec](https://doc.rust-lang.org/stable/std/vec/struct.Vec.html) to hold the elements of type `u32`. This way, we can grow our bitmap when
needed.

```rust
// src/lib.rs

pub use simple_bitmap::SimpleBitmap;
mod simple_bitmap;

// src/simple_bitmap.rs

pub struct SimpleBitmap {
    bits: Vec<u32>,
}
```

## Creating the Bitmap

We don't want to expose the `bits` field to users of our bitmap. Still, they need a way to construct an instance of the bitmap. That's why
we need a publicly exposed constructor method, conventionally named `new`.

```rust
// src/simple_bitmap.rs

impl SimpleBitmap {
    pub fn new() -> Self {
        Self { bits: Vec::new() }
    }
}
```

## Setting Bits

Time to implement setting a bit. Let's start with writing a test making use of the to-be-implemented `set` method. We'll extend this test
later when we implement getting a bit.

```rust
// src/simple_bitmap.rs

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_sets_bits() {
        // given
        let mut bm = SimpleBitmap::new();

        // when
        bm.set(31);
        bm.set(32);

        // then
        // todo: check validity once get is implemented
    }
}
```

What do we have to do when our bitmap is called with `bm.set(31)` or `bm.set(32)`? We first have to check in which `u32` we should set the
bit. Each `u32` holds 32 bits. So the first `u32` in our `bits` vector can store values for indices `0` up to and including `31`. The second
`u32` can store values for indices `32` up to and including `63` and so on. Bear in mind that we also have to check whether we allocated
enough `u32`s to access the `u32` at the given index.

For the provided index `31`, we have to access the `u32` at index `0` in our `bits` vector. For the provided index `32`, it's the `u32` at
index `1`. We can calculate this by dividing the provided index by `32`, i.e. the number of bits that fit into a `u32`, using
[integer division](https://mathworld.wolfram.com/IntegerDivision.html).

```rust
// src/simple_bitmap.rs

#[test]
fn get_bits_vector_index() {
    assert_eq!(31 / 32, 0);
    assert_eq!(32 / 32, 1);
}
```

Now that we figured out which `u32` to access in our `bits` vector, we need to think about which bit of the `u32` we need to modify. This,
we can do by either using the modulo operation, or by performing a bitwise and operation with the number `31_u32` (see
[rust operators](https://doc.rust-lang.org/book/appendix-02-operators.html)).

```rust
// src/simple_bitmap.rs

#[test]
#[allow(clippy::identity_op)]
fn get_bit_index_in_u32_using_modulo() {
    assert_eq!(31 % 32, 31);
    assert_eq!(32 % 32, 0);
}

#[test]
fn get_bit_index_in_u32_using_bitwise_and() {
    assert_eq!(31 & 31, 31);
    assert_eq!(32 & 31, 0);
}
```

Another mental model for what we are doing here is to think of splitting the provided index into bits `[0..27]`, i.e. the most significant
27 bits, and `[27..32]`, i.e. the least significant 5 bits
([explanation of most and least significant bits](https://en.wikipedia.org/wiki/Bit_numbering)). The 27 MSBs represent the index in the
`bits` vector. The 5 LSBs represent the bit position in the `u32`.

**Note that I'm using the least-significant-bit-last notation here, which means that leftmost bit is the most significant bit, while the
rightmost bit is the least significant bit.**

```shell
# 31_u32

# |                u32                |
# | 000000000000000000000000000 11111 |
# | --------- 27-msb ---------- 5-lsb |
#               |                 |
#               V                 |
#     index 0 in `bits` vector    |
#                                 V
#                             31st bit
#                             position

# 32_u32

# |                u32                |
# | 000000000000000000000000001 00000 |
# | --------- 27-msb ---------- 5-lsb |
#               |                 |
#               V                 |
#     index 1 in `bits` vector    |
#                                 V
#                             0th bit
#                             position
```

Accordingly, the `bits` vector of our `SimpleBitmap` should look like this after having performed both `bm.set(31)` and `bm.set(32)`.

```shell
# |     index 0 in `bits` vector     |     index 1 in `bits` vector    |
# |               u32                |                u32              |
# | 10000000000000000000000000000000 | 0000000000000000000000000000001 |
#   |                                                                |
#   V                                                                V
#  31st bit                                                       0th bit
#  position                                                       position
```

Time to put our thinking into code:

```rust
// src/simple_bitmap.rs

impl Bitmap for SimpleBitmap {
    fn set(&mut self, index: u32) {
        let u32_index_in_bits_vec = (index / 32) as usize;
        let bit_index_in_u32 = index & 0b11111;

        let stored_u32 = self.bits[u32_index_in_bits_vec];

        let modified_u32 = stored_u32 | (0b1 << bit_index_in_u32);

        self.bits[u32_index_in_bits_vec] = modified_u32;
    }

    // ...
}
```

I hope it's possible to follow the code after having walked through how we must choose the bit we want to set. Let's take a closer look at
`let modified_u32 = stored_u32 | (0b1 << bit_index_in_u32);` though. What's happening here?

`(0b1 << bit_index_in_u32)` is creating a [bitmask](<https://en.wikipedia.org/wiki/Mask_(computing)>), where only the bit at position
`bit_index_in_u32` is set to `1`. Doing the [bitwise or](https://doc.rust-lang.org/book/appendix-02-operators.html) operation with the
`stored_u32` preservers all bits that are set in `stored_u32`, and additionally sets the bit at position `bit_index_in_u32` to `1`.

Our test should pass now:

```shell
cargo test it_sets_bits
   Compiling bitmaps v0.1.0 (/Users/christian/codebase/bitmaps)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.19s
     Running unittests src/lib.rs (target/debug/deps/bitmaps-40c0e78a209450ab)

running 1 test
test simple_bitmap::tests::it_sets_bits ... FAILED

failures:

---- simple_bitmap::tests::it_sets_bits stdout ----
thread 'simple_bitmap::tests::it_sets_bits' panicked at src/simple_bitmap.rs:26:35:
index out of bounds: the len is 0 but the index is 0
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace


failures:
    simple_bitmap::tests::it_sets_bits

test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 6 filtered out; finished in 0.00s

error: test failed, to rerun pass `--lib`
```

Oops! `index out of bounds: the len is 0 but the index is 0`.

We forgot to check whether there is already enough `u32` integers in the `bits` vector when indexing into the vector using the calculated
`u32_index_in_bits_vec`. We need to add a check, and extend the vector with zeros if there is not enough `u32`s yet.

```rust
// src/simple_bitmap.rs

impl Bitmap for SimpleBitmap {
    fn set(&mut self, index: u32) {
        let u32_index_in_bits_vec = (index / 32) as usize;
        let bit_index_in_u32 = index & 0b11111;

        // if there is too little u32s in the bits vec, it has to be extended
        if u32_index_in_bits_vec >= self.bits.len() {
            self.bits.resize(u32_index_in_bits_vec + 1, 0);
        }

        let stored_u32 = self.bits[u32_index_in_bits_vec];

        let modified_u32 = stored_u32 | (0b1 << bit_index_in_u32);

        self.bits[u32_index_in_bits_vec] = modified_u32;
    }

    // ...
}
```

Now, our test passes:

```shell
cargo test it_sets_bits
   Compiling bitmaps v0.1.0 (/Users/christian/codebase/bitmaps)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.18s
     Running unittests src/lib.rs (target/debug/deps/bitmaps-40c0e78a209450ab)

running 1 test
test simple_bitmap::tests::it_sets_bits ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 6 filtered out; finished in 0.00s
```

## Getting Bits

There is little sense in storing information without a way to retrieve it - we need a `get` method.

We'll start by renaming and extending our existing `it_sets_bits` test.

```rust
// src/simple_bitmap.rs

#[test]
fn it_sets_and_gets_bits() {
    // given
    let mut bm = SimpleBitmap::new();

    // when
    bm.set(31);
    bm.set(32);

    // then
    assert!(!bm.get(0));
    assert!(bm.get(31));
    assert!(bm.get(32));
}
```

After having implemented `set`, `get` is a comparatively easy task.

```rust
// src/simple_bitmap.rs

impl Bitmap for SimpleBitmap {
    // ...

    fn get(&self, index: u32) -> bool {
        let u32_index_in_bits_vec = (index / 32) as usize;

        if let Some(bucket) = self.bits.get(u32_index_in_bits_vec) {
            let bit_index_in_u32 = index & 0b11111;

            ((bucket >> bit_index_in_u32) & 0b1) == 1
        } else {
            false
        }
    }

    // ...
}
```

And with this, our modified test also passes.

```shell
cargo test it_sets_and_gets_bits
   Compiling bitmaps v0.1.0 (/Users/christian/codebase/bitmaps)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.21s
     Running unittests src/lib.rs (target/debug/deps/bitmaps-40c0e78a209450ab)

running 1 test
test simple_bitmap::tests::it_sets_and_gets_bits ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 5 filtered out; finished in 0.00s
```

## Bit Unions

Remember the Islay distillery example from the [last blog post](./indices-and-bitmaps#using-a-bitmap-as-index)?

We built indices for the `region` column of our `distilleries` table:

```rust
// Islay       --> [1, 0, 0, 0, 1, 1, 0, 1, 1, 0]
// Speyside    --> [0, 1, 0, 0, 0, 0, 1, 0, 0, 0]
// Highlands   --> [0, 0, 1, 1, 0, 0, 0, 0, 0, 1]
```

Building unions for these indices, we can implement queries like

```sql
SELECT * FROM distilleries
WHERE region = 'Speyside' OR region = 'Highlands';
```

Let's use our `SimpleBitmap` to do this, thereby also meeting the third requirement that we stated in the beginning.

```rust
// src/simple_bitmap.rs

#[test]
fn it_builds_bit_unions() {
    // given
    // Speyside    --> [0, 1, 0, 0, 0, 0, 1, 0, 0, 0]
    let mut speyside_bm = SimpleBitmap::new();
    speyside_bm.set(1);
    speyside_bm.set(6);

    // Highlands   --> [0, 0, 1, 1, 0, 0, 0, 0, 0, 1]
    let mut highlands_bm = SimpleBitmap::new();
    highlands_bm.set(2);
    highlands_bm.set(3);
    highlands_bm.set(9);

    // when
    let speyside_or_highlands = speyside_bm | highlands_bm;

    // then
    // Union       --> [0, 1, 1, 1, 0, 0, 1, 0, 0, 1]
    assert!(!speyside_or_highlands.get(0));
    assert!(speyside_or_highlands.get(1));
    assert!(speyside_or_highlands.get(2));
    assert!(speyside_or_highlands.get(3));
    assert!(!speyside_or_highlands.get(4));
    assert!(!speyside_or_highlands.get(5));
    assert!(speyside_or_highlands.get(6));
    assert!(!speyside_or_highlands.get(7));
    assert!(!speyside_or_highlands.get(8));
    assert!(speyside_or_highlands.get(9));
    assert!(!speyside_or_highlands.get(10));
}
```

When we try to compile this, we get the following compiler error:

```shell
error[E0369]: no implementation for `simple_bitmap::SimpleBitmap | simple_bitmap::SimpleBitmap`
   --> src/simple_bitmap.rs:133:49
    |
133 |         let speyside_or_highlands = speyside_bm | highlands_bm;
    |                                     ----------- ^ ------------ simple_bitmap::SimpleBitmap
    |                                     |
    |                                     simple_bitmap::SimpleBitmap
    |
note: an implementation of `BitOr` might be missing for `simple_bitmap::SimpleBitmap`
```

The error message is very helpful and points us to the exact problem. As a solution, we could either merely implement `BitOr` for
`SimpleBitmap`, or additionally add a supertrait for our `Bitmap` trait. Let's do the latter.

```rust
// src/lib.rs

pub trait Bitmap: Sized + BitOr {
    fn set(&mut self, index: u32);

    fn get(&self, index: u32) -> bool;
}
```

I'll skip the reason why we have to add the `Sized` trait as a supertrait. If you're interested, you can read the reason in the
[language reference](https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility).

Let's implement the [BitOr](https://doc.rust-lang.org/stable/std/ops/trait.BitOr.html) trait for `SimpleBitmap`.

```rust
// src/simple_bitmap.rs

impl BitOr for SimpleBitmap {
    type Output = SimpleBitmap;

    fn bitor(self, rhs: Self) -> Self::Output {
        // allocate enough capacity for the larger of both vecs
        let mut union = Vec::with_capacity(cmp::max(self.bits.len(), rhs.bits.len()));

        let mut left_iter = self.bits.iter();
        let mut right_iter = rhs.bits.iter();

        // iterate over both iterators and perform the bitwise or operation as long as both iters yield u32s and
        // add the result to the union vector
        for (left, right) in iter::zip(&mut left_iter, &mut right_iter) {
            union.push(left | right);
        }

        // if there is u32s remaining in left, add the u32s to the union vector
        for left in left_iter {
            union.push(*left);
        }

        // if there is u32s remaining in right, add the u32s to the union vector
        for right in right_iter {
            union.push(*right);
        }

        SimpleBitmap { bits: union }
    }
}
```

And with this, our test passes:

```shell
cargo test it_builds_bit_unions
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.08s
     Running unittests src/lib.rs (target/debug/deps/bitmaps-40c0e78a209450ab)

running 1 test
test simple_bitmap::tests::it_builds_bit_unions ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 6 filtered out; finished in 0.00s
```

## Summary

In this blog post, we have built a straightforward implementation of a bitmap, which allows us to set and get bits. It also provides the
functionality to do unions between bitmaps.
