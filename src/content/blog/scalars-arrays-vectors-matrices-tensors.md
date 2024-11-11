---
title: "Scalars, Arrays, Vectors, Matrices, and Tensors"
description: "My take on clarifying the terminology around scalars, arrays, vectors, matrices and tensors."
pubDatetime: 2023-08-20T16:30:00+2
tags:
  - "data-science"
  - "terminology"
---

## Table of contents

## Introduction

In last week's article [Diving into Machine Learning](./diving-into-machine-learning), I laid out my plan to get
into the field of data science and machine learning.

I actually wanted to start with a blog post exploring the NumPy library. When reading the NumPy documentation and
additional resources I found on Google, I soon found out though, that I'd first have to get some mor clarity about
terminology in the data science space. So I decided to write this blog post first.

## The Terminology Zoo

I'm a little pedantic when it comes to consistency in terminology. Don't get me wrong. I hate jargon. I sometimes
feel like jargon just exists to make people sound smart and also to raise the entry barrier into a certain field. In my
medical studies, there was even a course in the first semester called "Medical Terminology". It was all about learning
the latin vocabulary for the human body. No better way to train doctors to not be understood by patients :). Still, I
think it's important to be consistent in the use of names for certain things. It confuses the hell out of me when I
read different names for the same thing.

I found myself in this situation when reading about scalars, vectors, arrays, matrices, and tensors. So let me try to
sort this out for myself and maybe for you as well. Please note that I'm obviously no mathematician or expert in this
field. I'm just trying to nail down a terminology that I can use consistently across my blog posts.

## Scalars

**A scalar is a single real number.**

```python
# a scalar
a = 2
# also a scalar
b = 5
```

Yes, there are a lot more formal definitions of scalars. I don't think they help us in our journey into data science.

## Arrays

**An array is a collection of elements of the same memory size.**

In data science, these elements are usually scalars. An array is ordered. Each element in the array can be accessed by a
unique index. The index is an integer. The index starts at 0. The number of elements in an array is called the length of
the array. The length of an array is a non-negative integer.

```python
# an array
a = [1, 2, 3, 4, 5]
len(a)  # returns 5
# also an array
b = []
len(b)  # returns 0
# also an array
c = [1]
len(c)  # returns 1
```

So far, so good. But arrays can be further characterized by their dimensionality. The arrays we just looked at are
actually one-dimensional arrays. Don't get intimidated by the term "dimensionality". The dimensionality of an array is
simply the number of indices needed to access an element in the array. So a one-dimensional array is an array that can
be accessed by one index. A two-dimensional array is an array that can be accessed by two indices. And so on. Let's look
at some examples.

```python
# a one-dimensional array
a = [1, 2, 3, 4, 5]
# to access an element, we need one index
a[0]  # returns 1

# a two-dimensional array
b = [[1, 2, 3], [4, 5, 6]]
# to access an element, we need two indices
b[0][0]  # returns 1

# a three-dimensional array
c = [[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]]
# to access an element, we need three indices
c[0][0][0]  # returns 1

# a four-dimensional array
d = [[[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]], [[[13, 14, 15], [16, 17, 18]], [[19, 20, 21], [22, 23, 24]]]]
# to access an element, we need four indices
d[0][0][0][0]  # returns 1
```

I think you get the idea. While humans are good with imagining one-, two-, and three-dimensional arrays, we have a
hard time imagining four-dimensional arrays and beyond. But we don't have to be able to imagine them. Because the
nice thing here is that the math that applies to one-dimensional arrays also applies to higher-dimensional arrays.
It worked best for me to just stop trying to imagine e.g. an array with 1000 dimensions.

Often times, you might read the term n-dimensional array. The n here simply stands for an arbitrary number of
dimensions. So an n-dimensional array is an array that can be accessed by n indices. If n = 5, we have a
five-dimensional array where you'll need five indices to access an element.

## Vectors

There is a lot of confusion around the term vector. Some authors use the term vector interchangeably with the term
array. Others use the term vector to describe a one-dimensional array. I found that the latter is the more common
use, so I'll stick with it.

**A vector is a one-dimensional array.**

```python
# a vector (i.e. a one-dimensional array)
a = [1]
# to access an element, we need one index
a[0]  # returns 1

# also a vector (i.e. a one-dimensional array)
b = [1, 2, 3, 4, 5]
# to access an element, we need one index
b[0]  # returns 1
```

## Matrices

**A matrix is a two-dimensional array.**

```python
# a matrix (i.e. a two-dimensional array)
a = [[1, 2, 3], [4, 5, 6]]
# to access an element, we need two indices
a[0][0]  # returns 1

# also a matrix (i.e. a two-dimensional array)
b = [[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]
# to access an element, we need two indices
b[0][0]  # returns 1
```

## Tensors

Tensors also come with different definitions, depending on the context. In the context of data science and machine
learning, tensors are used interchangeably with n-dimensional arrays.

**A tensor is an n-dimensional array.**

```python
# a one-dimensional tensor
a = [1, 2, 3, 4, 5]

# a two-dimensional tensor
b = [[1, 2, 3], [4, 5, 6]]

# a three-dimensional tensor
c = [[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]]

# a four-dimensional tensor
d = [[[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]], [[[13, 14, 15], [16, 17, 18]], [[19, 20, 21], [22, 23, 24]]]]
```

Note that many authors use the term tensor to specifically describe a three-dimensional array. In my blog posts,
I'll try to be consistent and thus also add the dimension to the term tensor. So I'll use the term three-dimensional
tensor instead of just tensor.
