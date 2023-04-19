---
title: Building a High-Speed, Scalable, and Fault-Tolerant System A/B Testing Middleware on The Edge
description: How far should we go to ensure a system is high-speed, scalable, and fault-tolerant simultaneously, and where is the limit?
slug: building-high-speed-scalable-and-fault-tolerant-ab-testing-middleware-on-edge
date: 2023-04-19
coverImage: TODO
blogOgImage: TODO
published: false
tags:
  - Architecture
---

Here’s the outline for the slides and what will be shown in the presentation:

## Intro about me and the talk (1-3 slides)

## The problem

- A/B testing
  - What is A/B testing in principle
- Architecture of the system
  - The previous solution at the organization
- Previous (slow & heavy) solution
  - Why the previous solution motivated us to look for an alternative
- Future (fast & lean) solution
  - New solution involving Edge Computing

## The solution (happy path) V1

- Cloudflare Worker
  - Cloudflare Edge network and their Workers
- A/B test decision made in the cloud and stored in the header
  - Using 3rd party tool for A/B testing and how the decision happens in the cloud near the end user
- Origin (backend)
  - What serves are listening and expecting A/B decision
- Edge Cache
  - We had to have everything CDN cached properly
- Testing everything
  - How to test the whole system and services that they are working
  - A tool called Artillery for high load testing

## The solution (when things go left) V2

- What happens if 3rd party A/B testing service is down?
  - We need to store events and resubmit when the service goes online
  - How to store events?
- Options for storing user events - KV, Durable Objects, Kafka, Amazon SQS
- Durable Objects
  - A feature from Cloudflare that introduces distributed computing/programming
- Emptying the queue from Durable Object
- Distributed Computing with Durable Object Groups
- Testing everything (again)
  - How we simulated 1000 req/s from our machines

## The solution (common sense) V1.1

- Cloudflare Worker does the main job
- If 3rd party service is down, save events to Durable Object and retry later
- Reestimate the cost of such fault tolerant system and put a limit on how tolerant it is
- Backup plan for future development

## Takeaways

- Speed and Scalability on Edge
- Fault tolerance and where to put a limit - figure out what you are building and for who, talk to management and people responsible for business decisions
- Have a backup plan
- Feel free to experiment
- Advocate for common sense (even if it does not appear as common)
