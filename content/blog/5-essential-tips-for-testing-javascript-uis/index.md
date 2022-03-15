---
title: 5 Essential Tips for Testing JavaScript UIs
description: These five tips stuck with me throughout the years of writing JavaScript tests. I am sure they will help you too.
slug: 5-essential-tips-for-testing-javascript-uis
date: 2021-06-30
canonical: https://javascript.plainenglish.io/5-essential-tips-for-testing-javascript-uis-3cbf57d507e0
canonicalName: Medium
coverImage: ./cover.jpg
blogOgImage: ./cover.jpg
published: true
tags:
  - Testing
  - JavaScript
---

When it comes to writing tests for (JavaScript) UIs, you either like it or not. But, if you’re inside a company that demands a certain test coverage threshold, or you want to have logic covered, you will have to do it eventually. Whatever your case is, I believe the following five tips will help you write better tests.

<figure>
  <img alt='Lavander field' src='https://miro.medium.com/max/1050/0*6wehmIg6j6R9KvrY' />
  <figcaption class='photo-caption'>
  Photo by <a src='https://unsplash.com/@anniespratt?utm_source=medium&utm_medium=referral'>Annie Spratt</a> on <a src='https://unsplash.com?utm_source=medium&utm_medium=referral'>Unsplash</a>
  </figcaption>
</figure>

I struggled a lot with writing tests when starting. The concept was pretty straightforward — you write code that validates other code you wrote. But, something was off back then, and I was not too fond of it at first. Fast forward a couple of years later, and I am now okayish with writing tests. I got my head around it. These are the tips I find most useful on day to day basis of writing UI tests.

## 1. Test Behavior, Not Implementation\*\*

For some, it might come naturally to follow the principle of testing UI behavior rather than implementation. But trust me, sometimes, in the depths of the test code, you might lose this idea and try to hack your way out of the test.

If you are familiar with Test Driven Development ([**TDD**](https://en.wikipedia.org/wiki/Test-driven_development)), there is also Behavior Driven Development ([**BDD**](https://en.wikipedia.org/wiki/Behavior-driven_development)). The idea is to create a script using a DSL (Domain-Specific Language) that almost everyone on the project can understand. For a long time, the primary tool to make it with was [Cucumber](https://cucumber.io/) (the library, not the vegetable). It would allow you to form a test script like so:

Feature: Put items in the cart Scenario: Breaker joins a game
Given the user has visited the awesome shopping page
When the user adds an item to the cart
Then the user should see the item in the cart

The idea is simple, and the implementation uses the Gherkin syntax with “Given”, “When”, and “Then” format. Scripts like these are there to have stakeholders read them and understand the features and scenarios, but I rarely see them reading them in practice.

Anyways, if you are not a fan of such tools, you can skip using it (duh), but keep in mind that you should test behavior.

## 2. Test One Thing At a Time

One great tip I’d give to myself a couple of years ago was to focus on testing one thing in one test. I used to test lots of different things in one test. One good thing that Cypress framework does is that they advise only to test the login functionality **once** and log in programmatically in all other tests.

So let’s say you are testing the adding an item to the shopping cart. Ideally, it would be best if you focused on that piece of UI functionality in the test. All of the other things like:

- logging in,
- seeding the items to be added to the card,
- publishing the store where the user will purchase the items

should all be part of the setup. You shouldn’t do all of these things directly in the test, but instead, just focus on the actions user takes to add an item to the cart.

## 3. Structure Tests Properly

Another thing that will set you up for success in testing is to follow the AAA patterns. AAA stands for the following:

- 1st A — **Arrange**: Put and perform everything needed to set up the test for the functionality that is about to get tested. Seed the data, log in the user, stub calls, etc.
- 2nd A — **Act**: Execute the actions like adding an item to the cart.
- 3rd A — **Assert**: Ensure that the received value satisfies the expectation. Make sure the test validates the expected behavior.

Go ahead, and try it out in your next test.

## 4. Use Helpers to Generate Test Data

Often, you face the same problem — the creation of particular data objects in tests. Whether that’s a product, user, random item, you have to create the object somehow in the test setup. One software design pattern that can help you out here is the [Factory pattern](https://en.wikipedia.org/wiki/Factory_method_pattern).

One library that can help us with generating objects is the [Fishery](https://github.com/thoughtbot/fishery) library. If you’re using TypeScript, these two can fit in perfectly. Let’s say we want to generate a user in our test. One way to do it is like this:

```typescript
// factories/user.ts

import { Factory } from "fishery"
import { User } from "../my-types"
import postFactory from "./post"

export const userFactory = Factory.define<User>(({ sequence }) => ({
  id: sequence,
  name: "Rosa",
  address: { city: "Austin", state: "TX", country: "USA" },
  posts: postFactory.buildList(2),
}))
```

Then, we can create the user without too much fuss like so:

```javascript
const user = userFactory.build({ name: "Sandra" })
```

You should now have more precise tests because you can generate objects without specifying all the attributes, only the ones relevant to the current test you are writing. Also, the user factory definition is in one place, and you can easily edit it from there, no need to go through all your tests when some attributes change.

## 5. Avoid Sleeping (In Tests)

We’ve all been there, setting some timeout to handle an async test case or to force the next tick. With the new tools, you don’t have to do this. If you’re testing some async code, you can use Jest to test it:

```javascript
test("the data is peanut butter", async () => {
  const data = await fetchData()
  expect(data).toBe("peanut butter")
})
```

With the simple _async / await_ syntax, no more of the _setTimeout_ is needed. Or, better yet, if you’re using [Cypress](https://www.cypress.io/), they have an integrated waiting mechanism that will give a certain amount of time for each command to perform. Also, in the _testing-library_, you can do _waitFor_ like described in [its docs](https://testing-library.com/docs/dom-testing-library/api-async/#waitfor).

Anyways, whatever you do, think twice before you call `setTimeout` or any other time-related methods because it will make your tests less readable and possibly flaky.

## Sum Up

Thanks for reading these five tips. I hope that you gained some insight after them. Also, I hope these help you write better UI tests for your JavaScript apps.

If you’re interested in more blog posts like these, consider subscribing to the [newsletter](https://pragmaticpineapple.com/newsletter). Also, if you find this blog post useful, you can share it with your friends and colleagues on Twitter below:

<blockquote class="twitter-tweet tw-align-center"><p lang="en" dir="ltr">I shared some of the tips for JS tests I came across throughout the years 👇<br><br>What is your number one tip for writing tests?<a href="https://t.co/nKf6r7qpxH">https://t.co/nKf6r7qpxH</a></p>&mdash; Nikola Đuza (@nikolalsvk) <a href="https://twitter.com/nikolalsvk/status/1410249787543363584?ref_src=twsrc%5Etfw">June 30, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Catch you in the next one, cheers.
