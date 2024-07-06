# Dynamo Paper

## Introduction

- Motivation
- Point out difference Dynamo and DynamoDB. Cliffhanger for next paper analysing the DynamoDB paper
- Discuss scale of Amazon
- Discuss requirements that Dynamo needs to meet

## Techniques

- Partitioning (consistent hashing)
- Replication (consistent hashing)
- Object versioning
- Quorums
- Gossip based distributed failure detection and membership protocol

## Outline

Section 2 presents the background and Section 3 presents the related work. Section 4 presents the system design and
Section 5 describes the implementation. Section 6 details the experiences and insights gained by running Dynamo in
production and Section 7 concludes the paper.

## Section 2

- Discuss Amazon SOA
- No need for the beast that a RDBMS is, when the only access pattern is key-value lookup
- RDBMS disadvantages of requiring experts to operate and limitations when it comes to scaling out
- Each service runs its own Dynamo instance --> Big difference to the service offered via DynamoDB in AWS

Requirements

- Interface: Get(key), Set(key, value); values are blobs, no schema, keys are strings, no multi-object transactions
- ACID: Discuss the problems around this terminology
    - Atomicity is provided
    - Consistency is no database concept
    - Isolation support is on a single-level object, as transactions are not supported
    - Durability is provided
- Runs on commodity hardware
- As each application runs own Dynamo instance, host scaling is limited to hundreds of hosts. AuthN and AuthZ is not
  required

SLAs focus on P99.9 instead of averages. Think about why. Things like tail latency amplification

Design considerations

- Asynchronous replication
- Concurrent writing --> Cannot be single leader replication
- Conflict resolution at read time
- Conflict resolution performed by application vs data storage
- Scaling out one node at a time
- Symmetry of nodes --> Points at leaderless replication
- Decentralization
- Heterogeneity of hosts

## Section 3: Related Work

## Section 4: System Architecture

### System interface

Get(key: byte[]) -> {values: byte[] | byte[][], context: Context }

Put(key: byte[], context: Context, value: byte[])

Todo: Determine what this context is

"this_is_my_key" | md5sum -> 128 bit identifier for storage node

### Partitioning algorithm

Consistent hashing with virtual nodes

--> Link to blogpost

### Replication

Asynchronous Replication to n Replicas on the hashing ring --> Stale reads are possible
Eventually consistent. In case of network failure, there is no upper bound on the inconsistent state

### Data Versioning

Vector clocks

## Summary

## Today's music

I love listening to music while playing with new technology or hacking on side projects. Today I was listening to the
fantastic [Unplugged Album of Eric Clapton](https://open.spotify.com/album/6zxsfP7TdXLAS9QEGNN0Uy).
