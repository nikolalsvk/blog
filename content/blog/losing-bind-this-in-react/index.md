---
title: Losing .bind(this) in React
description: Getting rid of .bind(this) in React component.
slug: losing-bind-this-in-react
date: 2018-01-13
canonical: https://medium.com/@nikolalsvk/loosing-bind-this-in-react-8637ebf372cf
canonicalName: Medium
coverImage: ./cover.jpg
blogOgImage: ./cover.jpg
published: true
tags:
  - JavaScript
  - React
---

Getting rid of .bind(this) in React component.

![Dark cane](./cover.jpg)

<div class="photo-caption">
Photo by <a href="https://unsplash.com/photos/ijOZg8e0ER0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">JANNIK SELZ</a> on <a href="https://unsplash.com/search/photos/cutting?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</div>

![bind this will be past](./this-will-be-past.png)

<div class="photo-caption">
This will be the past
</div>

If you used React in your time, you probably had to write some of _.bind(this)_ code. And yes, I know:

- it looks pretty **ugly**, plus,
- it’s taking up **some extra space** in the codebase.

Luckily, there are some proposed features of JavaScript that can make _.bind(this)_ the past for us.

Before I explain how to lose _.bind(this)_, I’ll show you a short example of where this can be used. Let’s say we want to render a button which changes its text when you click it. In order to do that, we would write a component similar to the one below 🔽.

```javascript
import React, { Component } from "react"

class ButtonWithBind extends Component {
  constructor() {
    super()

    this.state = { toggle: false }
  }

  toggleButton() {
    this.setState((prevState) => ({ toggle: !prevState.toggle }))
  }

  render() {
    const toggle = this.state.toggle

    return (
      <div>
        <button onClick={this.toggleButton}>{toggle ? "ON" : "OFF"}</button>
      </div>
    )
  }
}

export default ButtonWithBind
```

We set the _toggle_ switch in the state to _false_ in our constructor.

Also, we add the _toggleButton_ function as _onClick_ handler function, so it will get called when the button is clicked.

And, we create a simple _toggleButton_ function which toggles the state when called.

Awesome, seems like we’re good to go!

If we go ahead an click the rendered button, we’ll get a _TypeError_ like this:

![Can't set state](./cant-set-state.png)

<div class="photo-caption">
Dang it! It should work 🤔.
</div>

We’re getting an error because this is not defined when _onClick_ calls our _toggleButton_ function.

Usually, you would fix this by binding this to the _toggleButton_ function so it always stays the same. Let’s go ahead and bind this to our function in the constructor with:

```javascript
this.toggleButton = this.toggleButton.bind(this)
```

After adding it, our button component should look like this:

```javascript
import React, { Component } from "react"

class ButtonWithBind extends Component {
  constructor() {
    super()

    this.state = { toggle: false }

    this.toggleButton = this.toggleButton.bind(this)
  }

  toggleButton() {
    this.setState((prevState) => ({ toggle: !prevState.toggle }))
  }

  render() {
    const toggle = this.state.toggle

    return (
      <div>
        <button onClick={this.toggleButton}>{toggle ? "ON" : "OFF"}</button>
      </div>
    )
  }
}

export default ButtonWithBind
```

Try it out, it should do it’s work:

![It works!](./it-works.gif)

<div class="photo-caption">
Yay, it’s working! 🍾
</div>

## 🔪 .bind(this)

Now, let’s get rid of that annoying _.bind(this)_. In order to do that, we’ll use _experimental_ public class field feature in JavaScript. Public class field feature allows you to use arrow function syntax in your classes:

```javascript
toggleButton = () => {
  this.setState((prevState) => ({ toggle: !prevState.toggle }))
}
```

An arrow function **does not have** its own this, but it has the this value of the enclosing execution context. Arrow Functions **lexically** bind their context so `this` actually refers to the originating context. That’s called [Lexical Scoping](http://whatis.techtarget.com/definition/lexical-scoping-static-scoping) if you’re into naming things. Basically, it saves us from doing .bind(this) in our code.

Note that this is an _experimental_ feature in JS, which means it’s not yet accepted into ECMAScript standard, but let’s keep our fingers crossed that it will 🤞. Until that happens, you can configure babel to transpile it using [`babel-plugin-transform-class-properties`](https://babeljs.io/docs/plugins/transform-class-properties/).

Also, if you’re using [create-react-app](https://github.com/facebook/create-react-app) by any chance, public class fields are supported out of the box, so no additional setup is needed 🤘

## Possible pitfalls

Keep in mind that this can affect two things. First thing is **memory and performance**. When you use a class field to define a function, your method resides on **each instance of the class** and NOT on the prototype as it does using the _bind_ method. You can read about this in depth in a great article by [Donavon West](https://twitter.com/donavon) - “[Demystifying Memory Usage using ES6 React Classes](https://medium.com/dailyjs/demystifying-memory-usage-using-es6-react-classes-d9d904bc4557)“.

Second thing that can be affected by using public class field is how you write your unit tests. You won’t be able to use component prototype to stub on function calls like this:

```javascript
const spy = jest.spyOn(ButtonWithoutBind.prototype, "toggleButton")
expect(spy).toHaveBeenCalled()
```

You will have to find another way to stub the method, either by _passing the spy in props_ or _checking the state changes_.

## Using it inside the component

Now, let’s jump right in how we can use public class field in our component and change our _toggleButton_ function in order to lose _.bind(this)_:

```javascript
import React, { Component } from "react"

class ButtonWithoutBind extends Component {
  constructor() {
    super()

    this.state = { toggle: false }
  }

  toggleButton = () => {
    this.setState((prevState) => ({ toggle: !prevState.toggle }))
  }

  render() {
    const toggle = this.state.toggle

    return (
      <div>
        <button onClick={this.toggleButton}>{toggle ? "ON" : "OFF"}</button>
      </div>
    )
  }
}

export default ButtonWithoutBind
```

> Every React developer ever: _looks at line 22–24_ “WOW, so pretty 💅. **No more** of that pesky little .bind(this).”

What’s also great about public class fields is that we can define state right out of the constructor, and slim down our component:

```javascript
import React, { Component } from "react"

class ButtonWithoutBind extends Component {
  state = { toggle: false }

  toggleButton = () => {
    this.setState((prevState) => ({ toggle: !prevState.toggle }))
  }

  render() {
    const toggle = this.state.toggle

    return (
      <div>
        <button onClick={this.toggleButton}>{toggle ? "ON" : "OFF"}</button>
      </div>
    )
  }
}

export default ButtonWithoutBind
```

And voilà, we’ve lost _.bind(this)_, and we’ve slimmed down our component a bit, I call this a victory 🏁! We deserve some kind of an award. Feel free to stroll down the fridge and grab yourself a cold one 🍺, or a chocolate 🍫, or whatever you fancy, cus you just learned a whole new thing you can do in React 🎉.

Big thanks to [Kent C. Dodds](https://kentcdodds.com/) for making a video about this. This article wouldn’t exist without him. Cheers Kent 🍻.

If you liked what you saw, please 👏 and spread the word. Also, check out [my website](http://nikolalsvk.github.io/) and [follow me](https://twitter.com/nikolalsvk). I’ll be posting more of React related articles, so click “Follow” and stay tuned 🎥.

Also, retweeting this is a great way to help spread the word with your friends:

<div class="center-box">
<blockquote class="twitter-tweet tw-align-center"><p lang="en" dir="ltr">I just published “Losing .bind(this) in React” <a href="https://t.co/Wr5tNQRXpG">https://t.co/Wr5tNQRXpG</a></p>&mdash; Nikola Đuza (@nikolalsvk) <a href="https://twitter.com/nikolalsvk/status/952250266346315776?ref_src=twsrc%5Etfw">January 13, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Good luck! 🍻
