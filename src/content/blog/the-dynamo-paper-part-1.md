---
title: "The Dynamo Paper: Part 1"
description:
  "Part 1 of a blogpost series about the Dynamo Paper. This part focuses on why Dynamo was needed in the first place and what the specific
  requirements were that Dynamo had to meet."
pubDatetime: 2023-11-12T11:05:00+2
tags:
  - "dynamo"
  - "dynamodb"
  - "database"
  - "distributed database"
  - "nosql"
  - "horizontal scaling"
  - "paper"
---

## Table of contents

## Introduction

In my last blog post [Building a key-value store in Rust](./building-a-key-value-store-in-rust), I told you that I currently have to think a
lot about databases and their tradeoffs for work. One of the databases that I'm paying a lot of attention to is DynamoDB. DynamoDB is a
['Fast, flexible NoSQL database service for single-digit millisecond performance at any scale'](https://aws.amazon.com/dynamodb) There are
two milestone papers about this database:

1. [Dynamo: Amazon’s Highly Available Key-value Store](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)
2. [Amazon DynamoDB: A Scalable, Predictably Performant, and Fully Managed NoSQL Database Service](https://www.usenix.org/system/files/atc22-elhemali.pdf)

I have read the first one three years ago, but struggled to understand all the details. As I have gained more understanding about databases
and the challenges of distributing data in the last years, it was time to revisit this paper in depth and this time also write a blog post
about it. I hope to make the information in that paper more accessible by explaining some of the concepts one stumbles upon in the paper.

As we'll have to cover a fairly large ground, I've decided to split the paper walkthrough into several parts. Today, we'll start with the
first sections of the paper up to `Section 4: System Architecture`.

## Dynamo vs DynamoDB

First of all, it's important to understand that Dynamo and DynamoDB are two different databases. Dynamo is a key-value store that was used
internally by Amazon to support its massive e-commerce application. DynamoDB is the serverless, managed NoSQL database offered by AWS. It
builds a lot upon learnings gained from Dynamo, but it also differs in many core components. In this blogpost series we'll be concerned with
the Dynamo paper. The DynamoDB paper we'll look at at a later time.

## Introduction

The paper starts with an easy-to-read introduction. I have summarized the key messages:

Amazon operates at a massive scale. Not only today, but also did so in 2007, when the paper was published. It serves tens of millions of
customers using tens of thousands of servers. Reliability is the main concern of the retail website, as outages would lead to loss of
customer trust. Amazon runs a service oriented architecture (SOA), which nowadays would be called microservice architecture. This means that
there are many (hundreds to thousands) of services developed independently, which call each other to serve customer requests. Many of these
services are stateful, which means, that they need an available storage system to work properly.

At the scale of Amazon, it is not an exception but rather a common thing to have a small number of failing servers or network components.
Thus, storage systems that need to be highly available, must have some degree of fault tolerance built into them. At the same time, it was
noticed that most services exhibit only simple access patterns. This means, that the flexibility that e.g. SQL on top of relational database
management systems (RDBMS) offers, is oftentimes not needed. Most services only need Get and Set operations for key-value pairs.

**Dynamo is a highly available, distributed, eventually consistent key-value store built to store the application state of Amazon
services.**

What follows in the paper is a succinct description of the techniques used to implement Dynamo:

> Dynamo uses a synthesis of well known techniques to achieve scalability and availability: Data is partitioned and replicated using
> consistent hashing, and consistency is facilitated by object versioning. The consistency among replicas during updates is maintained by a
> quorum-like technique and a decentralized replica synchronization protocol. Dynamo employs a gossip based distributed failure detection
> and membership protocol. Dynamo is a completely decentralized system with minimal need for manual administration. Storage nodes can be
> added and removed from Dynamo without requiring any manual partitioning or redistribution.

That's a lot to swallow. I felt lost here, when I read the paper 3 years ago. If you're feeling the same way now, don't worry. We'll go into
the details of everything that was just mentioned.

## Background

The next section of the paper repeats some of the statements made in the introduction. The interesting part begins when the requirements
that Dynamo needs to meet (or does not need to meet), are specified:

- Query Model: Dynamo needs to support a simple Read and Write interface for key-value pairs.
- ACID Properties: Dynamo does not need to support transactions.
- Efficiency: Dynamo must be able to run on commodity hardware, while at the same time meeting tight SLAs (expressed as 99.9 percentiles).
- Authentication and Authorization: Dynamo does not need to support AuthN or AuthZ as it is used by Amazon internal services within a
  trusted network infrastructure.
- Tenancy: Every services uses its own Dynamo store. Dynamo is not shared across services.
- Configurability: Every service can tune its Dynamo store based on tradeoffs between durability, consistency, functionality, performance
  and cost-effectiveness.
- Consistency: Eventual consistency is sufficient.
- Conflict resolution: Done by the application at read time.
- Incremental scalability: Dynamo should be scalable one additional instance at a time.
- Symmetry: There are no leader or coordinator nodes. All nodes have the same responsibilities.
- Decentralization: This goes hand in hand with the symmetric approach.
- Heterogeneity: Dynamo should support nodes of different compute and/or disk size.

We'll get into most of these requirements and how they were implemented as well in the course of this blogpost series.

## Related Work

This section talks about peer-to-peer systems and distributed file systems and databases. I'm not an expert on peer-to-peer systems, so I
won't go into details here. Please refer to the paper if you want more information about this part.

I'd like to point out some statements made in the discussion of the related work section which are worth mentioning.

- The main goal of Dynamo is to offer an 'always writeable' storage. So availability is the main concern.
- There is no need for hierarchical storage (like you'd find in a file system). A flat structure suffices.
- Latency is a main concern as well. P99.9 for reads and writes need to be within hundreds of milliseconds.

## What's next

We covered the easier parts of the paper in this first blogpost. The next section is `System Architecture`, which is where things get more
technical. We'll start from there in the next blogpost of this series.
