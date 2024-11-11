---
title: "Indices and Bitmaps"
description: "Database indices and how to implement them using bitmaps"
pubDatetime: 2024-11-10T07:00:00+1
tags:
  - "database"
  - "index"
  - "bitmap"
  - "rust"
---

## Table of contents

## Introduction

In the last months, a project at work had me dive deep into the details of bitmaps. In this blog post series, I want to
share the knowledge I gained in that area.

To make this a bit more tangible, let's start with something you might be more familiar with. Let's say you are running
an e-commerce platform for whiskies. Your inventory is stored in a relational database. The (super simplified) database
schema for whisky distilleries you have in your inventory might look like this:

```sql
CREATE TABLE distilleries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL
);
```

Let's fill this table with 10 entries:

| id  | name         | region    |
| --- | ------------ | --------- |
| 0   | Bunnahabhain | Islay     |
| 1   | Macallan     | Speyside  |
| 2   | Ardmore      | Highlands |
| 3   | Oban         | Highlands |
| 4   | Ardbeg       | Islay     |
| 5   | Laphroaig    | Islay     |
| 6   | Glenfiddich  | Speyside  |
| 7   | Lagavulin    | Islay     |
| 8   | Bowmore      | Islay     |
| 9   | Glenmorangie | Highlands |

After some time, you want to expand your selection for whiskies produced on the isle of Islay (known for heavily peated
whiskies). You start by investigating which distilleries in that region you already have in your selection. For that,
you could run this query:

```sql
SELECT * FROM whiskies
WHERE region = 'Islay';
```

How can the database execute such a query quickly without having to look at all rows in the table? The answer is by
using indices. An index is a data structure that provides fast access to rows in a table based on specified columns.

Conceptually, the index for the column "region" might look like this:

```bash
# Islay       --> [0, 4, 5, 7, 8]
# Speyside    --> [1, 6]
# Highlands   --> [2, 3, 9]
```

When the database executes the SQL query, it will first look at the index, and only retrieve the entries with the IDs
that are stored for the entry `Islay`. In this case, the database would know that it had to retrieve the entries with
IDs `0`, `4`, `5`, `7` and `8`.

## Index Types

There is a wide variety of data structures that can be used to implement such indices. As an example, have a look at the
index types that [Postgres supports](https://www.postgresql.org/docs/current/indexes-types.html).
As part of this blogpost, we'll look at bitmaps, and how they can be used to implement indices.
Especially [OLAP](https://en.wikipedia.org/wiki/Online_analytical_processing)
databases oftentimes support bitmap indices (e.g. [Apache Druid](https://druid.apache.org/)), but
also [OLTP](https://en.wikipedia.org/wiki/Online_transaction_processing) databases like Postgres can make use of
bitmap conversions when answering certain SQL queries.

## Using a Bitmap as Index

Let's come back to our index for the column `region`:

```rust
// Islay       --> [0, 4, 5, 7, 8]
// Speyside    --> [1, 6]
// Highlands   --> [2, 3, 9]
```

How to represent this index with bitmaps?

A bitmap data structure is an array of bits where each bit represents the state (such as presence or absence) of an
item. The size of the bitmap is the number of bits that can be stored.

For our index, we can do the following:

- Let the number of rows (10) in the `distilleries` table be the size of the bitmap
- Let the position in the bitmap be the `id` of the entry in the `distilleries` table
- Let a 0-Bit (unset bit) be absence of the entry, and the 1-Bit (set bit) be the presence of the entry

The bitmap index for the column `region` would look like this:

```rust
// Islay       --> [1, 0, 0, 0, 1, 1, 0, 1, 1, 0]
// Speyside    --> [0, 1, 0, 0, 0, 0, 1, 0, 0, 0]
// Highlands   --> [0, 0, 1, 1, 0, 0, 0, 0, 0, 1]
```

Now, when the database executes our query to return all distilleries in the region, it could get the list of the
positions of the bits that are set (i.e. are equal to 1). For `Islay`, the positions of the bits - i.e. the `ids` of the
rows in the `distilleries` table - that are equal to one, are `0`, `4`, `5`, `7` and `8`.

Let's say we next wanted to know which distilleries we have in our selection in the regions `Speyside` or `Highlands`.
The SQL query for this would be:

```sql
SELECT * FROM whiskies
WHERE region = 'Speyside' OR region = 'Highlands';
```

For this query, the database could get the bitmaps for both `Speyside` and `Highlands` and do a bitwise union. A bitwise
union between two bitmaps is done by setting a bit to one if either of the two input bitmap bits is set to one.

```rust
// Speyside    --> [0, 1, 0, 0, 0, 0, 1, 0, 0, 0]
// OR
// Highlands   --> [0, 0, 1, 1, 0, 0, 0, 0, 0, 1]
// ----------------------------------------------

// Union       --> [0, 1, 1, 1, 0, 0, 1, 0, 0, 1]
```

The positions of the bits in the `Union` bitmap that are equal to one are `1`, `2`, `3`, `6` and `9`.

## Summary

Database indices can be used for optimizing database query performance by quickly locating relevant rows without
scanning entire tables. A bitmap is a data structure that can be used to implement a database index. By performing
bitwise operations, multidimensional queries can be supported.
