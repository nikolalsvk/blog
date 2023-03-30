---
title: How to Sync Your Storybook Design System Into Figma
description: Effective design systems need design and code in sync. Here's how Anima continuously synced MongoDB components from Storybook into Figma.
slug: how-to-sync-your-storybook-design-system-into-figma
date: 2023-03-16
canonical: https://www.animaapp.com/blog/design-systems/how-to-sync-your-storybook-design-system-into-figma/?utm_source=designer-advocate&utm_medium=social&utm_campaign=ds-automation-launch&utm_content=how-to-sync-storybook-to-figma
canonicalName: Anima
coverImage: ./storybook-to-figma-anima-mongodb.png
blogOgImage: ./storybook-to-figma-anima-mongodb.png
published: true
tags:
  - JavaScript
  - Figma
  - Storybook
---

![Cover](./storybook-to-figma-anima-mongodb.png)

We’re excited to announce **_Design System Automation by Anima_**, which **automatically turns your Storybook into a native Figma library, then keeps it continuously synced with any code updates**. The generated Figma components include **variants**, **Auto Layout parameters**, **Figma Styles**, and actual **code from Storybook**.

Designers can build flows with the same components developers will use to build the product. Developers get designs containing the exact components they have in the code, along with names, props, Storybook links, and their own code references. That makes handoff and implementation a breeze.

Anima’s Design System Automation solution gives teams consistent, lightning-fast builds, perfect fidelity, and eliminates friction between design and development.

In this article, we’ll demonstrate:

1.  How to connect Storybook to Figma using Anima
2.  How to generate a Figma library from your design system code components, and
3.  How Anima keeps Figma continuously synced with production.

Let’s get to it!

## Step 1. Connect Storybook and Figma using Anima’s integration

First off, you will need to download the [Anima plugin for Figma](./https://www.figma.com/community/plugin/857346721138427857/Anima---Export-Figma-to-HTML%2C-React-%26-Vue-code). Once you have it installed in Figma, go ahead and open the Anima plugin.

![Open Anima plugin](./01-open-anima-plugin.png)

![Anima plugin opened](./02-anima-plugin-opened.png)

1. To start syncing Storybook and Figma, you will need to install the Anima CLI. For this example, we’ll use LeafyGreen—MongoDB’s design system in Storybook —and install the Anima CLI there. You can install the CLI inside your own project with the following commands:

```bash
yarn add -D anima-storybook-cli
```

Or, if you’re using `npm`, like so:

```bash
npm install –save-dev anima-storybook-cli
```

2. Once the Anima CLI is installed, we need to generate a Storybook build. In the showcase project, we are doing it with this command:

```bash
yarn build-storybook
```

Now that the Storybook is built, we can sync it with Anima and Figma using the Anima CLI and the token we got in the Anima Figma plugin. To sync Storybook and Figma, run the following command:

```bash
yarn anima-storybook sync -t YOUR_TOKEN
```

The `anima-storybook` will prepare and sync files to your Figma project and report when it finishes. The important thing here is to pass the token from the Anima Figma plugin.

3. Once the sync is finished, go to Figma and the Anima plugin will show the following prompt:

![Copy and paste link to Figma](./03-copy-and-paste-figma-link.png)

4. Then, click “Start generating components”:

![Figma link saved](./04-figma-linked-saved.png)

After some time, Anima will wire up the Storybook and Figma and allow you to generate Figma components from Storybook.

## Step 2. Generate Figma components from Storybook code

Now that the Storybook and Figma are synced via Anima’s CLI, we can generate any Storybook component right from Figma. Unimported Storybook components will appear in the Anima plugin like so:

![Showing unimported components](./05-unimported-components.png)

We’ll start by expanding the carousel of unimported components and searching for ‘Button’:

![Search for a Button component](./06-search-for-button.png)

Then, we’ll select the Button variants we wish to import. In this case, ‘Button’ has a lot of props, and Anima can identify and generate every possible combination as a unique variant in Figma:

![Importing a button](./07-button-importing.png)

When the import is finished in the plugin, we can go ahead and click “Generate” next to the Button component:

![Button imported](./08-button-imported.png)

And Anima will start generating variants of the Button right in Figma:

![Button generating](./09-button-generating.png)

Once complete, the Button will appear as synced and we can go ahead and preview the generated Figma components by either clicking the four dots in the plugin or navigating to the “Components/Button” page in Figma:

![Button synced in Figma](./10-button-synced.png)

Anima will generate a separate page in Figma with all of the Button component variants, as demonstrated below:

![Button generated in Figma](./11-button-generated.png)

We can switch between the Button’s variants using Figma’s native control panel:

![Changing button variants](./12-changing-button-variants.gif)

What’s also great is that you can preview the code you’ll implement directly from Figma’s inspect panel. The code includes the updated props, and the naming conventions are identical to those used in Storybook:

![Show Button code](./13-show-code.png)

Also, whenever you import a component that includes a button, Anima will recognize it as a subcomponent so you can edit that instance alone:

![Button as a subcomponent in Figma](./14-button-as-subcomponent.png)

This is definitely a game-changer when it comes to bridging the gap between designers and developers. But what happens when the Button changes in the code?

In the next section, we’ll demonstrate how Anima automatically syncs Storybook code updates to Figma.

## Step 3. Sync Storybook and Figma

So we changed some logic inside the Button component in the code, but how do we ensure those updates are synced in Figma? First, we need to rebuild the Storybook with:

```
yarn build-storybook
```

Next, we need to sync Storybook to Figma again using Anima’s CLI:

```
yarn anima-storybook sync -t YOUR_TOKEN
```

Once we’ve synced, the Anima plugin in Figma will notify us that we have some unsynced changes to our component library:

![Unsynced changes in Figma](./15-unsynced-changes.png)

All we need to do is click “Update,” and Anima will sync the changes to the existing Button:

![Syncing changes](./16-changes-syncing.png)

Once the changes are synced, we can see that the Button element has a change reflected. I added a letter “A” to be rendered in every button, which can be clearly seen in each variant below:

![Changes synced](./17-changes-synced.png)

And that’s it. You can incorporate the `yarn anima-storybook sync` command somewhere in your continuous integration (CI) workflow so that changes are synced, for example, whenever code is pushed to the main branch of your project. This will ease the handoff process, accelerate frontend builds, and allow developers to focus on logic and backend architecture. If you have a complex, dynamic design system, this is a great solution for keeping designers aligned with production.
