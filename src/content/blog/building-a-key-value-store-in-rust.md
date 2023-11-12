---
title: "Building a key-value store in Rust"
description: "Building a key-value store in Rust for fun and learning about databases and Rust."
pubDatetime: 2023-10-27T13:54:00+2
tags:
  - "key-value store"
  - "rust"
  - "durability"
  - "hash table"
  - "storage engine"
  - "deep dive"
  - "database"
---

## Table of contents

## Introduction

It has been some time since I published the last article. As it often happens with side projects / hobby interests, I
got a little sidetracked. So this blog post won't be a continuation of my machine learning blog posts. I'm sure I will
soon pick up the machine learning journey at some point in time though 🙃.

In my job as a software engineer at Amazon, I recently had to think a lot about the tradeoffs of different database
technologies for various data models. Obviously, this was the perfect time to pick up Martin Kleppmann's fantastic
book [Designing Data-Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/)
again. I have written a short summary about this book in my blog post [Book List 2022](./book-list-2022).

Also, I wanted to get my feet wet with Rust. I have started to learn Rust during a hackathon project last year,
continued a little in my free time, but haven't done any side projects with it since then. I'm inspired by the very
informative videos that Jon Gjengset is sharing in his [YouTube channel](https://www.youtube.com/@jonhoo) (they're
really worth watching! His technical expertise is astonishing).

To sum up, the motivation for this blog post was to

1. Re-read parts of 'Designing Data-Intensive Applications'
2. Implement some techniques discussed in the book to gain a deeper understanding and
3. get some hands-on experience with Rust.

So today, we'll be looking a little into how storage engines work and how we can build a simple key-value store
ourselves. We start out with a very simple approach and then extend it with technique called 'indexing' to speed up the
performance.

## Building the world's simplest database

The most fundamental thing that a database must be able to do is "I give you this piece of information now. Store it for
me and let me retrieve it at some time in the future".

Turns out, it's quite easy to do this using two bash functions leveraging the file system abstraction that UNIX
operating systems offer us.

So here is the simplest key-values store in the world (Note: This example is taken from 'Designing Data-Intensive
Applications' p. 70).

```bash
db_set() {
  echo "$1,$2" >> /tmp/simpledatabase.log
}

db_get() {
  grep "^$1," /tmp/simpledatabase.log | sed -e "s/^$1,//" | tail -n 1
}
```

We can use this key-value store like this:

```bash
db_set hello world
db_set foo bar
db_set bar baz

db_get hello
> world

db_set hello there

db_get hello
> there
```

So as you can see, this database supports a GET and a SET operation. When we set a value for the same key twice, only
the latest value will be returned, as we would expect from a database.

So how does our database file look like after executing the mentioned commands?

```bash
cat /tmp/simpledatabase.log

> hello,world
> foo,bar
> bar,baz
> hello,there
```

## Storage engines

We just built a storage engine using two bash functions. Isn't that neat? Storage engines are at the heart of databases.
They are responsible for persisting the data that you put into your database to disk. Turns out, there is not that many
conceptually different storage engines. Both relational databases and NoSQL databases make use of two different kinds of
storage engines:

**Log-structured storage engines and page-oriented storage engines.**

The storage engine that our simple database makes use of is an instance of a so-called 'Log-structured storage engine'.
Why is it called like that? Because we simply use a log file (log in this case describes an append-only file) to store
our data.

## Analyzing the performance of the world's simplest database

The write performance of our simple database is fairly good, as a SET operation simply involves appending to a file.
More importantly, this operation does not slow down when the amount of data grows. Appending to a 1kB file is just as
fast as appending to a 1MB file. In other words, our SET operation has a runtime complexity of O(1), i.e. it's constant.
That's very good news!

Things look different when analyzing the read performance. We are using `grep` to search the key in the file. `grep` has
to scan the entire file. The output of `grep` is then piped into `sed`. Depending on the number of times that the
searched key has been updated (via the SET command), `sed` will have to either read through on one single line, or once
again the entire file. So the bigger the file gets, the worse our performance gets. Or, put more precisely, the amount
of work we have to do for a READ operation grows linearly with the amount of data we have stored in our file. In Big O
notation, this translates to O(n). As you can imagine, that's no good news.

But enough theory. Let's benchmark our simple database a bit.

## Benchmarking the world's simplest database

For our benchmark, we use [hyperfine](https://github.com/sharkdp/hyperfine) to repeatedly run our bash
functions `db_get` and `db_set`. To get some sense of the statistical distribution, I let `hyperfine` run the commands
1000 times (except for in the 1GB file case for time reasons 🙃). I have prepared an empty database file, a database file
with 1MB of `foo,bar` lines and one with 1GB of `foo,bar` lines.

Of course, this is a very rudimentary benchmarking setup, but it suffices for our analysis. Also note that you
shouldn't trust the absolute numbers here, as hyperfine invokes a shell for each execution which adds to the time spent
per command. However, our benchmark is suited to analyze the trends in the numbers depending on the database file size.

### Benchmarking with an empty database file

```bash
ls -lh simpledatabase.log
> -rw-r--r--  1 christian  wheel     0B Oct 26 16:48 simpledatabase.log

hyperfine --shell=bash --runs 1000 'db_set hello world'
> Benchmark 1: db_set hello world
>  Time (mean ± σ):       0.6 µs ±  19.5 µs    [User: 0.0 µs, System: 0.0 µs]
>  Range (min … max):     0.0 µs … 615.2 µs    1000 runs

hyperfine --shell=bash --runs 1000 'db_get hello'
> Benchmark 1: db_get hello
>  Time (mean ± σ):     891.9 µs ± 100.0 µs    [User: 578.9 µs, System: 1677.1 µs]
>  Range (min … max):   772.3 µs … 2842.8 µs    1000 runs
```

### Benchmarking with a 1MB database file

```bash
ls -lh simpledatabase.log
> -rw-r--r--  1 christian  wheel   1.0M Oct 26 16:47 simpledatabase.log

hyperfine --shell=bash --runs 1000 'db_set hello world'
> Benchmark 1: db_set hello world
>   Time (mean ± σ):       2.4 µs ±  75.2 µs    [User: 0.0 µs, System: 0.0 µs]
>   Range (min … max):     0.0 µs … 2378.8 µs    1000 runs

hyperfine --shell=bash --runs 1000 'db_get hello'
> Benchmark 1: db_get hello
>   Time (mean ± σ):      10.4 ms ±   0.4 ms    [User: 10.0 ms, System: 1.9 ms]
>   Range (min … max):     9.9 ms …  22.9 ms    1000 runs
```

### Benchmarking with a 1GB database file

```bash
ls -lh simpledatabase.log
> -rw-r--r--  1 christian  wheel   1.0G Oct 26 16:46 simpledatabase.log

hyperfine --shell=bash --runs 1000 'db_set hello world'
> Benchmark 1: db_set hello world
>   Time (mean ± σ):       1.8 µs ±  57.1 µs    [User: 0.0 µs, System: 0.0 µs]
>   Range (min … max):     0.0 µs … 1805.3 µs    1000 runs

hyperfine --shell=bash --runs 20 'db_get hello'
> Benchmark 1: db_get hello
>   Time (mean ± σ):      9.130 s ±  0.262 s    [User: 8.960 s, System: 0.117 s]
>   Range (min … max):    8.920 s …  9.860 s    20 runs
```

### Results

As you can see, the `db_set` does not deteriorate with growing database file size.

`db_get` however, shows dramatic decline in performance depending on the database file size. While it's below 1ms for
an almost empty database file (the `db_set` run of course inserted some commands), it's already at 10ms for 1MB database
file. With a 1GB database file, each `db_get` operation already takes **9,13 seconds** on average.

In summary, `db_set` performance is already very good. It's O(1), i.e. constant time, and it's also trivial to
implement. However, `db_get` performance is prohibitively bad with a growing database file size. We have to do something
about that.

## Solving the problem of slow reads

The root cause of the terrible read performance is that the `db_get` operation has to go through the entire database
file to be able to retrieve the latest value for a given key. However, we can introduce additional metadata about
entries in the database file. This metadata we'll call an index. We can use an in-memory hash table to store mappings
from keys to the location of the corresponding entry in the database file. That way, we can first look up the key in the
in-memory hash table. If an entry exists, we'll be returned the location of the entry in the database file. We then only
have to read the file at that location.

To implement this, we'll switch gears a little and use Rust.

## High-level design for kv-store

I'm not a big fan of designing and planning out every detail before starting to code. At the same time, I do think it's
a good idea to roughly lay out the high-level design before starting to code. After all, it's a lot faster to refactor
a high-level design than it is to refactor already written code.

For this project, I've collected the following high-level design decisions:

- The key-value store uses a custom application protocol on top of TCP
- The storage engine uses an append-only file to store data
- A custom binary format is used to store data in the append-only file
- An in-memory hash map is used to maintain an index
- The index will not be persisted to disk
- The supported operations will be GET, SET and DELETE

## Implementing kv-store

When writing this blog post, I realized that it might be an overkill to walk through the complete `kv-store`
implementation in this blog post. So instead, I decided to just go through the SET operation as an example and point out
the most important things.

For those interested: You can find the complete code of `kv-store` at https://github.com/ChristianSchleifer/kv-store.

So let's look at the SET operation. At the storage engine level of `kv-store`, the implementation looks like this:

```rust
pub(crate) fn set(&mut self, key: String, value: String) -> io::Result<()> {
    let entry_metadata = self.file_store.set(key.clone(), value)?;
    self.index.set(key, entry_metadata);
    Ok(())
}
```

As you can see, the key-value pair is first appended to the database file. Given that his was successful, metadata about
the entry is saved in the variable `entry_metadata`. But how exactly does this appending to the database file work and
what kind of metadata are we talking about here? Let's next look at the `EntryMetadata` struct and the set method
implementation of the `FileStore`.

```rust
#[derive(Debug, Clone, Copy)]
pub struct EntryMetadata {
    pub start: u64,
    pub key_length: u64,
    pub value_length: u64,
}

pub fn set(&mut self, key: String, value: String) -> io::Result<EntryMetadata> {
    let mut entry = Entry::new(key, value.as_bytes());
    let bytes = entry.serialize();

    self.append_handle.write_all(bytes.as_slice())?;
    let position = self.append_handle.seek(SeekFrom::Current(0))?;

    Ok(EntryMetadata::new(
        position - bytes.len() as u64,
        entry.key.len() as u64,
        entry.value.len() as u64))
}
```

The `FileStore` set method first serializes the key-length, the value-length, the key and the value to a slice of bytes.
These bytes are then written to the database file. The location of the file descriptor after writing the entry is then
stored in the variable `position`.

The `EntryMetadata` struct is constructed by passing it the `position` minus the length of the bytes that were just
written to the file, as well as the key length and value length. This metadata is sufficient to efficiently perform read
operations. Take a look at
the [GET operation](https://github.com/ChristianSchleifer/kv-store/blob/main/src/store/file_storage.rs#L47-L59) if you
are curious how this works.

Let's go up one call in the method call chain again. You know this method already:

```rust
pub(crate) fn set(&mut self, key: String, value: String) -> io::Result<()> {
    let entry_metadata = self.file_store.set(key.clone(), value)?;
    self.index.set(key, entry_metadata);
    Ok(())
}
```

Now that we know what the set method on the `FileStore` does and what data it returns, we can proceed. Next, the
metadata is stored in the `Index`.

Time to look at the `Index` set method.

```rust
pub struct Index {
    hashmap: HashMap<String, EntryMetadata>,
}

pub fn set(&mut self, key: String, entry_metadata: EntryMetadata) {
    self.hashmap.insert(key, entry_metadata);
}
```

This method is quite trivial. The only thing it does is to store the metadata for a particular key in a Rust
HashMap. In the average case, Rust HashMaps allow for constant Read and Write access (O(1)).

## Benchmarking kv-store

Time to benchmark `kv-store`. Once again, we use [hyperfine](https://github.com/sharkdp/hyperfine) to repeatedly run our
commands ( e.g. `GET hello" | nc 127.0.0.1 7878`) and generate some statistics for us. We'll invoke each command 1000
times and make our test with an empty database file, a 1MB (filled with distinct entries) and 1GB (filled with distinct
entries) database file.

Let me point out again that this benchmark is not suited to make callouts about absolute numbers. After all, we'll
measure a lot more than only the `StorageEngine` operations. In this case, we'll also measure the time it takes for the
TCP connection to be established and for the data to be transmitted over the TCP socket. This involves several calls
into the kernel network stack, thus adding latency.

However, we can use the benchmark to analyze trends in the numbers depending on the database file size.

### Benchmarking with an empty database file

```bash
ls -lh log.db
> -rw-r--r--  1 christian  wheel     0B Oct 27 08:20 log.db

hyperfine --runs 1000 "echo 'SET hello world' | nc 127.0.0.1 7878"
> Benchmark 1: echo 'SET hello world' | nc 127.0.0.1 7878
>   Time (mean ± σ):       1.6 ms ±   0.2 ms    [User: 0.4 ms, System: 0.8 ms]
>   Range (min … max):     1.2 ms …   4.2 ms    1000 runs


hyperfine --runs 1000 "echo 'GET hello world' | nc 127.0.0.1 7878"
> Benchmark 1: echo 'GET hello world' | nc 127.0.0.1 7878
>   Time (mean ± σ):       1.6 ms ±   0.1 ms    [User: 0.4 ms, System: 0.8 ms]
>   Range (min … max):     1.3 ms …   2.9 ms    1000 runs
```

### Benchmarking with a 1MB database file

```bash
ls -lh log.db
> -rw-r--r--  1 christian  wheel   1.0M Oct 27 09:37 log.db

hyperfine --runs 1000 "echo 'SET hello world' | nc 127.0.0.1 7878"
> Benchmark 1: echo 'SET hello world' | nc 127.0.0.1 7878
>   Time (mean ± σ):       1.6 ms ±   0.2 ms    [User: 0.5 ms, System: 0.8 ms]
>   Range (min … max):     1.3 ms …   3.8 ms    1000 runs

hyperfine --runs 1000 "echo 'GET hello world' | nc 127.0.0.1 7878"
> Benchmark 1: echo 'GET hello world' | nc 127.0.0.1 7878
>   Time (mean ± σ):       1.6 ms ±   0.4 ms    [User: 0.4 ms, System: 0.8 ms]
>   Range (min … max):     1.2 ms …   7.6 ms    1000 runs
```

### Benchmarking with a 1GB database file

```bash
ls -lh log.db
> -rw-r--r--  1 christian  wheel   1.0G Oct 27 09:46 log.db

hyperfine --runs 1000 "echo 'SET hello world' | nc 127.0.0.1 7878"
> Benchmark 1: echo 'SET hello world' | nc 127.0.0.1 7878
>   Time (mean ± σ):       1.5 ms ±   0.2 ms    [User: 0.4 ms, System: 0.8 ms]
>   Range (min … max):     1.2 ms …   4.0 ms    1000 runs

hyperfine --runs 1000 "echo 'GET hello world' | nc 127.0.0.1 7878"
> Benchmark 1: echo 'GET hello world' | nc 127.0.0.1 7878
>   Time (mean ± σ):       1.5 ms ±   0.1 ms    [User: 0.4 ms, System: 0.8 ms]
>   Range (min … max):     1.2 ms …   2.3 ms    1000 runs
```

### Results

As expected, this time, both read and write performance does not deteriorate, but stays constant. In Big O notation,
this means that both our reads and writes are served in O(1) time.

## Tradeoffs

We might be thinking now: 'Great, this greatly improved our read performance while not having any disadvantages'. We'd
be wrong. If there is one key takeaway from this blog post, then it's

> For every solution/approach, there are tradeoffs. Make sure to analyze them. Then evaluate the tradeoffs and decide
> whether they are a good fit for your problem.

What does this mean in our case? Let's look at the Pros and Cons of introducing the index data structure.

### Pros

- Performing reads in constant time, i.e. O(1), instead of linear time, i.e. O(n).

### Cons

- Increased memory consumption of the process because of the necessity to hold the index in memory. When
  running `kv-store` on the 1GB database file, memory consumption of the process is at 1.9GB.
- Limitation that the index must fit into memory. For example, my machine wouldn't be able to hold the index for a 1TB
  file with only distinct key-value pairs in memory.
- Writes get a tiny bit slower as the hashmap has to be updated in addition to writing to the file.
- Loading the index from the database file at startup takes time as the entire database file has to be scanned to build
  the index. This can be worked around by persisting the index to disk as well. However, this will add additional
  complexity.

## Summary

Writing a storage engine seems pretty straight forward. But as always, the devil is in the details. There are numerous
features our `kv-store` is missing for it to be a production-grade key-value store. Just to mention a few: It lacks
proper error handling, multithreading, buffered I/O, log compaction, index persistence, handling of
crashes during writes to the database file, distribution across multiple machines etc.

However, to grasp the basic principles that underlay a simplistic storage engine, this small project was very helpful to
me. And I hope, that this blog post was helpful to you as well 🙂.

## Today's music

I love listening to music while playing with new technology or hacking on side projects. Today I was listening to the
fantastic [Unplugged Album of Eric Clapton](https://open.spotify.com/album/6zxsfP7TdXLAS9QEGNN0Uy).
