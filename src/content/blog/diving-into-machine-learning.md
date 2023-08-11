---
title: "Diving into Machine Learning"
description: "My starting into the world of machine learning."
pubDatetime: 2023-08-11T12:30:00+2
tags:
  - "data-analysis"
  - "data-visualization"
  - "machine-learning"
---

## Table of contents

## Introduction

There is a lot of hype going on about Large Language Models. Since the rise of LLMs like ChatGTP, my interest in the
field has grown as well. It feels like there is actually happening something big right in front of our eyes. I project
LLMs to become more important in the future with my work as a software engineer. I want to understand what's possible
with current state-of-the-art AI. And honestly, I am a little bored because I killed my last side project.

Professionally, I've had little exposure to data science and machine learning. During the time I did my doctoral
thesis in medicine, I started digging into the field as I was fed up with counting cells in immunofluorescence images
manually. So I fine-tuned some pre-trained neural net to detect the cells in images automagically. As I was less
knowledgeable with programming in general back then, my approach was more of a trial and error approach without
really understanding what was actually happening behind the scenes.

I don't want to dig into LLMs straight away. Of course, I did play around with ChatGPT and also neat projects like
[PrivateGPT](https://github.com/imartinez/privateGPT). I took some
high-level [course on generative AI](https://www.coursera.org/learn/generative-ai-with-llms) that was recently launched
by AWS together with DeepLearning.ai. But that's it. That's all I know about the technology behind LLMs so far.
When it comes to non-LLM machine learning, I'm also a blank slate. I have spent the last weeks to get a basic
understanding of linear and logistic regression (thankfully, I had lots of statistics during my studies so that was
easy going). Also, I dipped my feet into the world of neural networks and deep learning. To get a rough overview, I can
highly recommend
the [Machine Learning Specialization](https://www.coursera.org/specializations/machine-learning-introduction)
as well as the [Deep Learning Specialization](https://www.coursera.org/specializations/deep-learning). I haven't
finished the latter one yet, but I'll definitely do so during the next couple of weeks. Andrew Ng kills it.

## The Plan

> Und jedem Anfang wohnt ein Zauber inne,
> Der uns beschützt und der uns hilft, zu leben.

_Hermann Hesse, Stufen_

> A magic dwells in each beginning,
> protecting us, telling us how to live.

_Hermann Hesse, Stufen, English translation_

While this is true and I already feel exited to get my feet wet in a new field, I also feel a little overwhelmed. Time
to make a plan for how to tackle this.

I love [https://roadmap.sh/](https://roadmap.sh/). That's where I normally go first when I want to dive into a new
field. Unfortunately, they don't have a roadmap for machine learning yet. Next, I tried Google Search. More and more, it
feels to me like Gogle has become a trash place for random SEO optimized listicles which contain crappy advice. Okay,
let's consult ChatGPT (GPT-4 version) instead:

> I want you to act as a data science and machine learning expert. I am a experienced software engineer with little to
> no data science and machine learning expertise. Lay out a step-by-step roadmap for me to ramp up in data science and
> machine learning.

Unfold to see the complete answer. It's quite long. I'll go through it step-by-step though.

<details>
<summary>ChatGPT answer</summary>

Of course! Here's a structured step-by-step roadmap for you to ramp up in data science and machine learning:

> ### 1. **Foundational Knowledge**:
>
> 1. **Mathematics**:
>
> - **Linear Algebra**: Understand matrices, vectors, eigenvalues, and eigenvectors.
> - **Calculus**: Understand concepts like differentiation and integration.
> - **Statistics**: Basics of mean, median, mode, standard deviation, probability, and distributions.
>
> 2. **Programming**:
>
> - Get comfortable with **Python**, as it's widely used in data science.
> - Learn libraries like **NumPy** and **Pandas** for data manipulation.
>
> ### 2. **Data Analysis**:
>
> 1. **Data Cleaning**: Learn techniques to clean and preprocess data.
> 2. **Exploratory Data Analysis (EDA)**: Understand data using visualization tools like **Matplotlib** and **Seaborn**.
> 3. **Feature Engineering**: Learn how to derive new features, deal with missing values, and encode categorical data.
>
> ### 3. **Intro to Machine Learning**:
>
> 1. Learn the difference between supervised, unsupervised, and reinforcement learning.
> 2. Understand key concepts: training/testing data, overfitting/underfitting, bias/variance trade-off.
> 3. Get started with a simple algorithm like **Linear Regression**.
>
> ### 4. **Dive Deeper into Machine Learning**:
>
> 1. **Classification Algorithms**: Logistic Regression, Decision Trees, Random Forests, Support Vector Machines.
> 2. **Regression Algorithms**: Polynomial Regression, Ridge, Lasso.
> 3. **Unsupervised Learning**: K-means clustering, Hierarchical clustering, DBSCAN.
> 4. **Ensemble Methods**: Boosting, Bagging.
> 5. **Evaluation Metrics**: Understand metrics like accuracy, precision, recall, F1-score for classification and MAE,
>    MSE, RMSE for regression.

> ### 5. **Advanced Machine Learning**:
>
> 1. **Neural Networks & Deep Learning**: Learn about perceptrons, multi-layer perceptrons, backpropagation.
>
> - Dive into **Convolutional Neural Networks (CNNs)** for image tasks.
> - Explore **Recurrent Neural Networks (RNNs)** and its variants like **LSTM** and **GRU** for sequence data.
>
> 2. **Natural Language Processing (NLP)**: Text preprocessing, word embeddings, and models like BERT.
> 3. **Reinforcement Learning**: Q-learning, deep Q networks.
>
> ### 6. **Toolkits and Frameworks**:
>
> 1. **Scikit-Learn**: A go-to library for traditional machine learning algorithms.
> 2. **TensorFlow & Keras**: For deep learning.
> 3. **PyTorch**: Another powerful deep learning library.
> 4. **Spacy & NLTK**: For NLP tasks.
>
> ### 7. **Model Deployment**:
>
> 1. Learn how to convert a model into an API using frameworks like **Flask** or **FastAPI**.
> 2. Understand deployment platforms like **Heroku**, **AWS Sagemaker**, or using **Docker** containers.
>
> ### 8. **Projects & Portfolio**:
>
> 1. Start with small projects: e.g., a housing price prediction, a spam classifier.
> 2. Move to more complex projects: e.g., image recognition, sentiment analysis, recommendation systems.
> 3. Document and showcase your work on platforms like **GitHub**.
>
> ### 9. **Continuous Learning & Specialization**:
>
> 1. Stay updated with the latest research papers, blogs, and articles.
> 2. Attend workshops, webinars, and conferences.
> 3. Specialize if a particular area intrigues you, like computer vision, NLP, or reinforcement learning.
>
> ### 10. **Networking**:
>
> 1. Connect with professionals on platforms like **LinkedIn**.
> 2. Join data science communities, participate in hackathons, and join ML competitions on platforms like **Kaggle**.
>
> Remember, while this roadmap provides a structured path, your journey will depend on your interests, goals, and the
> time you can dedicate. Practice is key in data science and machine learning, so always keep experimenting and working
> on real-world problems.

</details>

Sounds good enough to me. Let's go through it step by step.

## Foundational Knowledge

> 1. **Mathematics**:
>
> - **Linear Algebra**: Understand matrices, vectors, eigenvalues, and eigenvectors.
> - **Calculus**: Understand concepts like differentiation and integration.
> - **Statistics**: Basics of mean, median, mode, standard deviation, probability, and distributions.
>
> 2. **Programming**:
>
> - Get comfortable with **Python**, as it's widely used in data science.
> - Learn libraries like **NumPy** and **Pandas** for data manipulation.

My maths skills are somewhat limited. Having never studies computer science, my maths exposure ended with high school.
I do understand matrices and vectors, while I have no clue what eigenvalues and eigenvectors are. No clue what
differentiation and integration are. I'll skip that for now. The statistics section looks very familiar to me. As I
already wrote in the introduction, medicine also involves lots of statistics, so this is familiar ground for me. I'll
put the linear algebra and calculus stuff on my TODO list for now. I feel like it might be a good idea to do
the [Mathematics for Machine Learning and Data Science Specialization](https://www.coursera.org/specializations/mathematics-for-machine-learning-and-data-science)
at some time.

I'd consider myself a fairly good programmer. While Python is not my main programming language, I had some exposure
to it both when doing side projects. I also use it occasionally in my work as software engineer when I need to write
some script. So let's put a checkmark here.

Numpy and Pandas are well known in the data science universe as far as I know. My understanding is that Numpy's main
purpose is to provide crazy fast n-dimensional arrays (Python is known for normally not being the fastest programming
language). Pandas is like an Excel sheet that scales. It provides mainly data manipulation tools. I know these
libraries, but I'm not familiar with their main APIs. So this will be something I should look into.

## Data Analysis

> 1. **Data Cleaning**: Learn techniques to clean and preprocess data.
> 2. **Exploratory Data Analysis (EDA)**: Understand data using visualization tools like **Matplotlib** and **Seaborn**.
> 3. **Feature Engineering**: Learn how to derive new features, deal with missing values, and encode categorical data.

Okay so there is some familiar stuff in here as well. Data cleaning sounds like the real world application of Pandas
APIs. Matplotlib and Seaborn are just some libraries to visualize data. Probably loads of APIs to learn there as
well. It might be more interesting to look into which chart types are best to choose for certain data.
Feature engineering was mentioned in Andrew Ng's courses a couple of times. Basically, this boils down to picking
and/or creating features, i.e. inputs, that will make your model perform better. Definitely something where I've had
no exposure. This might be something that could be learnt on the fly when doing data analysis.

## Intro to Machine Learning

> 1. Learn the difference between supervised, unsupervised, and reinforcement learning.
> 2. Understand key concepts: training/testing data, overfitting/underfitting, bias/variance trade-off.
> 3. Get started with a simple algorithm like **Linear Regression**.

Okay, the first point will just be a quick google search to understand the differences. The second point requires
more investment in my opinion. I have a rough understanding of the terms mentioned, but I wouldn't know how to
collect the right metrics to be able to judge these things.
The third point is an easy one. I was taught Linear Regression statistics in university (though we did it manually
on paper...).

## Dive Deeper into Machine Learning

> 1. **Classification Algorithms**: Logistic Regression, Decision Trees, Random Forests, Support Vector Machines.
> 2. **Regression Algorithms**: Polynomial Regression, Ridge, Lasso.
> 3. **Unsupervised Learning**: K-means clustering, Hierarchical clustering, DBSCAN.
> 4. **Ensemble Methods**: Boosting, Bagging.
> 5. **Evaluation Metrics**: Understand metrics like accuracy, precision, recall, F1-score for classification and MAE,
>    MSE, RMSE for regression.

Okay there's lots of stuff I don't know yet in here: Decision Trees, Random Forests, Support Vector Machines, Ridge,
Lasso, Hierarchical clustering, DBSCAN, Boosting, Bagging, precision, recall, F1-score, RMSE. So lots of ground to cover
here.

## Advanced Machine Learning

> 1. **Neural Networks & Deep Learning**: Learn about perceptrons, multi-layer perceptrons, backpropagation.
>
> - Dive into **Convolutional Neural Networks (CNNs)** for image tasks.
> - Explore **Recurrent Neural Networks (RNNs)** and its variants like **LSTM** and **GRU** for sequence data.
>
> 2. **Natural Language Processing (NLP)**: Text preprocessing, word embeddings, and models like BERT.
> 3. **Reinforcement Learning**: Q-learning, deep Q networks.

Okay that's a lot of stuff. I'm a little surprised to not see Transformers mentioned here, but then again, I have
very little experience in that area. This section is big TODO.

## Toolkits and Frameworks

> 1. **Scikit-Learn**: A go-to library for traditional machine learning algorithms.
> 2. **TensorFlow & Keras**: For deep learning.
> 3. **PyTorch**: Another powerful deep learning library.
> 4. **Spacy & NLTK**: For NLP tasks.

I've heard of Scikit-Learn, TensorFlow, Keras, and PyTorch. I've never heard of Spacy and NLTK. I'll look into the
applications of each of these frameworks and their pros and cons. I think some of them might be competing libraries,
such as TensorFlow and PyTorch. So it might be a good idea to pick one of them and stick with it.

## Model Deployment

> 1. Learn how to convert a model into an API using frameworks like **Flask** or **FastAPI**.
> 2. Understand deployment platforms like **Heroku**, **AWS Sagemaker**, or using **Docker** containers.

I have done lots of DevOps work professionally. So this is something I'm very familiar with. I've never used Flask
before, but it's probably just yet another framework. There is this trendy word `MlOps` which probably just covers
how to put models into production. It might be interesting though to explore what's special about these models in
comparison to other software like web applications.

## Projects & Portfolio

> 1. Start with small projects: e.g., a housing price prediction, a spam classifier.
> 2. Move to more complex projects: e.g., image recognition, sentiment analysis, recommendation systems.
> 3. Document and showcase your work on platforms like **GitHub**.

While this might be obvious advice, I can't stress it enough. There is nothing like putting your skills into
practice. At some point, one has to leave the sole consumption of information and actually do something with it. The
sooner, the better.

## Continuous Learning & Specialization

> 1. Stay updated with the latest research papers, blogs, and articles.
> 2. Attend workshops, webinars, and conferences.
> 3. Specialize if a particular area intrigues you, like computer vision, NLP, or reinforcement learning

This is fairly general advice. I'm a big fan of good blogs. I'll have to do some research on the best ones in this
field though. I'll definitely share my list with you.

## Networking

> 1. Connect with professionals on platforms like **LinkedIn**.
> 2. Join data science communities, participate in hackathons, and join ML competitions on platforms like **Kaggle**.

This is fairly general advice as well. Kaggle was mentioned before so let's just continue.

## What's Next?

I think I got a rough understanding of what I need to learn to get into the field of data science and machine
learning. I think I'll start with Numpy and Pandas APIs to get a little more dangerous when looking at and preparing
data for machine learning tasks.

## Today's music

I love listening to music while playing with new technology or hacking on side projects.
Today I was listening
to [Soft Chill House Mix - Amii Watson B2B Jimmi Harvey](https://www.youtube.com/watch?v=k7HmLM7ZBBU).
