---
title: "Dependency Injection Without the Bloat: Why I Skip Java Dependency Injection Frameworks"
description:
  My personal take on why I think the Dependency Injection Pattern helps me write better code while Dependency Injection Frameworks only add
  complexity.
pubDatetime: 2026-02-16T06:00:00Z
tags:
  - "dependency injection"
  - "design pattern"
  - "dependency injection framework"
---

## Table of contents

## Dependency Injection Pattern != Dependency Injection Framework

When reading Wikipedia, blog posts or when asking your favorite LLM, the dependency injection (design) pattern and dependency injection
frameworks are often considered to be one and the same. In the Java ecosystem, it is broadly assumed that neither can exit without the
other. That is why advantages and disadvantages are not properly attributed to one or the other. I'm convinced that the dependency injection
pattern helps me write better code. I'm sceptical that dependency injection frameworks like Google Guice provide enough benefits that would
justify the complexity they add to a project. Let me explain my reasoning.

## Dependency Injection Pattern

The term `Dependency Injection` is a mouthful and yet it fails to convey what is meant by it. I define the dependency injection pattern like
this:

**In dependency injection, a composite type is being passed its dependencies from outside instead of it creating them.**

I'm wondering whether `Dependency Passing` would have been the better name. The word `Injection` is giving the wrong impression of something
special happening. It's a five dollar term for something that could have been expressed with a fifty cent word. But let's stick with the
original term. The dependency injection pattern does not need `@Inject` annotations, framework magic or, even worse, entire inversion of
control containers. Instead, every mainstream programming language I know of already comes with what you need to do dependency injection:
The ability to pass parameters to functions.

When a composite type is constructed in a function (in Java, these functions are called constructors and get some special treatment), it
doesn't create an instance of the type it depends on, but instead takes that type as a function parameter.

Imagine we're building yet another AI agent framework and we want to message our subscribers about new features. We could do this by having
an interface called `Notifier` and an email-based implemenation of it.

```java
public interface Notifier {

  void sendNotification(String message);
}

public class EmailNotifier implements Notifier {

  @Override
  public void sendNotification(String message) {
    // do API calls over the network
  }
}
```

We could make use of the `EmailNotifier` by creating an instance of it in the constructor.

```java
public class AgentFrameworkNoDI {

  private final Notifier notifier;

  public AgentFrameworkNoDI() {
    notifier = new EmailNotifier();
  }

  public void launchNewFeature(String featureName) {
    notifier.sendNotification(featureName);
  }
}

public class Main {

  public static void main(String[] args) {
    AgentFrameworkNoDI agentFrameworkNoDI = new AgentFrameworkNoDI();
  }
}
```

Or, we use dependency injection and accept and instance of that type as constructor paramater.

```java
public class AgentFrameworkWithDI {

  private final Notifier notifier;

  public AgentFrameworkWithDI(Notifier notifier) {
    this.notifier = notifier;
  }

  public void launchNewFeature(String featureName) {
    notifier.sendNotification(featureName);
  }
}

public class Main {

  public static void main(String[] args) {
    EmailNotifier emailNotifier = new EmailNotifier();
    AgentFrameworkWithDI agentFrameworkWithDI = new AgentFrameworkWithDI(emailNotifier);
  }
}
```

**That's all there is to the dependency injection pattern.**

So what's the big deal?

### Advantages

#### Improved Testability

Improved testability is the main advantage of the dependency injection pattern.

Given we want to write a unit test that makes sure that we notify our customers of a new feature when we launch it. We don't want do
real-world API calls to send emails in a unit test.

To be able to write this unit test for the `AgentFrameworkNoDI`, I can only think of replacing the `notifier` instance variable via
reflection with a fake or mock. It's not a straight-forward solution, but it works for Java. This wouldn't be an option for any language
without the support for reflective mutation.

```java
class AgentFrameworkNoDITest {

  private final Notifier notifier = mock(Notifier.class);
  private final AgentFrameworkNoDI agentFrameworkNoDI = new AgentFrameworkNoDI();

  @Test
  void it_should_notify_customers_when_launching_new_features() throws Exception {
    // given
    Field notifierField = AgentFrameworkNoDI.class.getDeclaredField("notifier");
    notifierField.setAccessible(true);
    notifierField.set(agentFrameworkNoDI, notifier);

    // when
    agentFrameworkNoDI.launchNewFeature("fancy-new-feature");

    // then
    verify(notifier).sendNotification("fancy-new-feature");
  }
}
```

For `AgentFrameworkWithDI`, writing the test is more straight forward as we can just pass whatever implementation of `Notifier` we want, be
it a mock, stub or fake.

```java
class AgentFrameworkWithDITest {

  private final Notifier notifier = mock(Notifier.class);
  private final AgentFrameworkWithDI agentFrameworkWithDI = new AgentFrameworkWithDI(notifier);

  @Test
  void it_should_notify_customers_when_launching_new_features() {
    // when
    agentFrameworkWithDI.launchNewFeature("fancy-new-feature");

    // then
    verify(notifier).sendNotification("fancy-new-feature");
  }
}
```

#### Looser coupling

By passing the dependencies instead of creating them within the composite type, you reduce coupling between the composite type and its
dependencies. When passing the dependency, the composite type needs no knowledge about how to create an instance of the dependency.

Let's say we're adding a second `Notifier` implementation which delivers notifications via telefax. Creation of `TelefaxNotifier` instances
require many arguments, all of the same type. One has to know exactly which argument to pass in which position to create it properly.

```java
public class TelefaxNotifier implements Notifier {

  private final String someParam1;
  private final String someParam2;
  private final String someParam3;

  public TelefaxNotifier(String someParam1, String someParam2, String someParam3) {
    this.someParam1 = someParam1;
    this.someParam2 = someParam2;
    this.someParam3 = someParam3;
  }

  @Override
  public void sendNotification(String message) {
    // do some legacy stuff
  }
}
```

If we wanted to use this notifier in `AgentFrameworkNoDI`, `AgentFrameworkNoDI` would require the knowledge how to create instances of this
type.

```java
public class AgentFrameworkNoDI {

  private final Notifier notifier;

  public AgentFrameworkNoDI() {
    // notifier = new EmailNotifier();
    this.notifier = new TelefaxNotifier("some", "arbritraty", "arguments");
  }

  public void launchNewFeature(String featureName) {
    notifier.sendNotification(featureName);
  }
}
```

However, our `AgentFrameworkWithDI` wouldn't have to change at all since we only took a dependency on the functionality we actually need.
Put more concretely, we didn't depend on `EmailNotifier`, but rather `Notifier` as sending notifications was the only dependency we needed.
It's not turtles all the way down. At some point, we do have to create the `TelefaxNotifier`. In this case, we'd do it in the `main` method.

```java
public class Main {

  public static void main(String[] args) {
    TelefaxNotifier telefaxNotifier = new TelefaxNotifier("some", "arbritraty", "arguments");
    AgentFrameworkWithDI agentFrameworkWithDI = new AgentFrameworkWithDI(telefaxNotifier);
  }
}
```

### Disadvantage

#### Less Locality of Behavior

The main disadvantage of this pattern is the decreased locality of behavior. Getting a full picture of a composite type and its instances
includes knowing what concrete type a dependency is of, and whether the dependency was created once for all instances or once per instance
of the composite type. Without dependency injection, the developer can just look at the function (constructor) creating the composite type.
When using dependency injection, the developer has to navigate the codebase to the place where instances of the composite type are created.

## Dependency Injection Frameworks

We have covered the Dependency Injection Pattern. Let's talk about the frameworks now. What problems do dependency injection frameworks try
to solve?

Here's the take from Google Guice ([source](https://github.com/google/guice)):

> Put simply, Guice alleviates the need for factories and the use of new in your Java code. Think of Guice's @Inject as the new new. You
> will still need to write factories in some cases, but your code will not depend directly on them. Your code will be easier to change, unit
> test and reuse in other contexts.

You might have noticed that the Google Guice team mixes pattern and framework as well. Making code easier to change and unit test is a
benefit of the dependency injection pattern, not the framework. So the only feature I can extract from this is that dependency injection
frameworks change the mechanism for object creation. To what benefit? I don't know. Particularly in today's world where LLMs are writing the
majority of (boilerplate) code, saving a couple of lines of code to create instances of objects is of little benefit.

Unfortunately, using dependency injection frameworks comes at a cost.

### Cognitive Overhead

Dependency injection frameworks try to abstract over object creation. However, they're a
[leaky abstraction](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/) at best. Now, on top of having to keep the
programming language specificiation in mind, the developer has to know the framework semantics in detail as well. Which annotations to use
to get a dependency passed at runtime by the framework? How to declare modules that specify dependency creation? How to declare how often
instances of the type should be created? What is the execution order for modules and dependency creators? All this knowledge is required to
write functionally correct code and thus adds cognitive overhead.

### Lost Compile Time Guarantees

Java is is a statically typed language. When using a statically typed language, you are committing to some additional effort when writing
code for the benefit of stronger correctness guarantees before running that code. Using a statically typed language that doesn't offer
stronger guarantees at compile time defeats the purpose of static typing. Dependency injection frameworks let you circumvent the type system
in Java in a non-obvious way. Look at this example which compiles without warnings but fails at runtime:

```java
public class AIUnicornWithGuice {

  private final Notifier notifier;

  @Inject
  public AIUnicornWithGuice(Notifier notifier) {
    this.notifier = notifier;
  }

  public void launchNewFeature(String featureName) {
    notifier.sendNotification(featureName);
  }
}

public class Main {

  public static void main(String[] args) {
    Injector injector = Guice.createInjector();
    AIUnicornWithGuice aiUnicorn = injector.getInstance(AIUnicornWithGuice.class);
  }
}
```

What's the problem with this code? The constructor of `AIUnicornWithGuice` takes a single parameter of type `Notifier`. However, we didn't
provide any guidance on how to create instances of that type. Consequently, Guice will exit in the main method with the error message
`[Guice/MissingImplementation]: No implementation for Notifier was bound.`. Without a dependency injection framework, the Java compiler
forces us to pass a variable of type `Notifier` (or at least an explicit `null`) to the constructor of `AIUnicornWithGuice`.

_Note: I don't have experience with `Dagger` in Java. From what I understand, this framework relies on checks at compile time._

### Framework Incompatibilities and Differing Defaults

Any software package requires maintenances, and so do dependency injection frameworks. Dependencies have to be updated, security risks have
to be mitigated and bugs have to be fixed. When a maintainer of an open source software packages stops taking care of that package, you can
either step up and take over maintenance, or you have to switch to a framework that is still maintaned. Switching the dependency injection
framework is non-trivial, requires code changes and a deep understanding of the replacement.

This is mainly due to two issues: First, these frameworks do not use a consistent set of annotations. Spring DI uses `@Autowired`, Guice
uses `@com.google.inject.Inject`. [JSR-330](https://jcp.org/en/jsr/detail?id=330) helped by introducing standard annotations that all major
DI frameworks support now (e.g. `@jakarta.inject.Inject`). However, the `javax` to `jakarta` namespace transition for these standard
annotations added to the mess. Second, the DI frameworks rely on different defaults. In Spring, you get singleton instances by default. In
Guice, you get one instance per injection point. In CDI, you also get one instance per injection point, but it's bound to the lifcycle of
the object it was injected into as well.

### Worse Large Language Model Support

LLM-based coding agents such as [Claude Code](https://code.claude.com/docs) or [OpenAI Codex](https://openai.com/codex/) are fluent in all
mainstream programming languages. They have been trained with enough code available on the public internet. There is less training data on
dependency injection frameworks. While in my personal experience, the frontier LLMs perform reasonably well for the most popular dependency
injection frameworks in Java (Spring, CDI, Guice, Dagger), they sometimes get confused about more esoteric features of dependency injection
frameworks (e.g. child injectors in Guice). But why even go through this layer of indirection? LLMs do not care whether they have to spit
out some additional lines of code to create objects.

## Conclusion

As I stated in the beginning of this post, I'm convinced that the dependency injection pattern helps me write better code. However, I can't
see advantages that justify the cost of using dependency injection frameworks. Maybe these frameworks are just a relic of a pre-LLM past.
While I disagree and commit to using these frameworks at my job, I do not use them in my private coding projects.
