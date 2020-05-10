---
title: Building and Deploying Microservices with AWS Lambda and Semaphore
description: AWS Lambda is an AWS service that runs code in response to events or HTTP requests. Here's how to easily build and deploy a Node.js Lambda microservice.
slug: building-and-deploying-microservices-with-aws-lambda-and-semaphore
date: 2015-12-22
canonical: https://semaphoreci.com/community/tutorials/building-and-deploying-microservices-with-aws-lambda-and-semaphore
canonicalName: Semaphore Blog
coverImage: ./cover.png
blogOgImage: ./cover.png
tags:
  - JavaScript
  - Serverless
  - AWS
---

[AWS Lambda](https://us-west-2.console.aws.amazon.com/lambda/) is a service from the [Amazon Web Services](https://aws.amazon.com/) family which runs your code based on various events. When you create a _Lambda function_ and deploy your code to it, AWS Lambda takes care of provisioning and managing servers that run your code.

This tutorial will show you how to develop a Node.js Lambda function from scratch and deploy it to AWS Lambda. To achieve a continuous delivery workflow for our function, we will automate the deployment process through Semaphore’s integration with Lambda.

Once the function is complete, it will text message anyone who breaks the build on your project on Semaphore.

The function we are developing will use:

- [Grunt](http://gruntjs.com/) (a task runner for Javascript, which we will use to invoke our function locally)
- [NPM](https://www.npmjs.com/) (the primary package manager for Node.js),
- [Twilio API](https://www.twilio.com/docs/api/rest) (we will use Twilio’s API to send text messages)
- [AWS SDK for Node.js](https://aws.amazon.com/sdk-for-node-js/) (a simple and easy-to-use API for AWS services)

## Prerequisites

To develop this function, you will need:

- An [AWS account](http://aws.amazon.com/)
- A [GitHub repository](https://help.github.com/articles/create-a-repo/) to which we will push our code
- A [Semaphore project](https://semaphoreci.com/docs/adding-github-bitbucket-project-to-semaphore.html) where we will build and deploy the code,
- A [Twillio account](https://www.twilio.com/) for texting users who break the build (we’ll use the free account).

## Initializing a Lambda Function

A Lambda function is basically the code that is run when a function is invoked. Typically, it is invoked by the events that you define.

Let’s create a new Lambda function. To do so, we need to go to the [Lambda console](https://us-west-2.console.aws.amazon.com/lambda/) and click on _Get Started Now_.

To start with, we will select the _Hello World_ Node.js blueprint for our function.

After you have selected a blueprint, you should get the following screen:

Now we need to name our function, give it a description, and choose the runtime language, as shown below.

We will leave the _Lambda function code_ section as is, and we will replace that code with our own once we are ready.

Under _Lambda function handler and role_ we will keep the default `index.handler` handler, but we will need to create a new execution role. You can learn more about execution roles in the [AWS Lambda documentation on granting permissions using the execution role](https://docs.aws.amazon.com/lambda/latest/dg/intro-permission-model.html#lambda-intro-execution-role).

We will use the S3 API in our code, so we will need an S3 execution role for the function. More on that later on.

Select the _S3 execution role_ in the dropdown menu to create a role.

This will take you to a dialog where you can create a new IAM Role. We will name it `semaphore-deploy-role`. This role has a set of permissions that will both let us use AWS SDK in our code and let Semaphore do the deployment for us. After you have created a new IAM Role, you can click on _Allow_.

Now that you’ve created an IAM role for your function, you can go ahead and select it.

Next, we will increase timeout to 6 seconds, and leave the required memory at 128 MB under _Advanced settings_.

After we’ve done all of this, our settings should look like this:

Click on _Next_, review the function details and click on _Create function_.

## Writing the Code

## Storing Phone Numbers

Now that we have created a Lambda function, it’s time to write some code. We will create a function that retrieves the JSON file from AWS S3. We will add the emails and phone numbers of the users who are working on our project on Semaphore to this file. This file will also contain the Twilio credentials (the Account SID, the Authentication Token and the Twilio Number). This data is stored on S3 so that no one can see it in our code.

### Retrieving Twilio Credentials

You can retrieve your Twilio credentials from [their website](https://www.twilio.com/), given you have previously created a (free) Twilio account. You will also need to enable sending SMS messages to your country in the [international settings](https://www.twilio.com/user/account/settings/international/sms) for your account and verify your number and every other number to which you will need to send text messages. You can do that on the [Twilio verified numbers](https://www.twilio.com/user/account/phone-numbers/verified) page.

Next, open an editor of your choice and make a file named `numbers.json`. Add your email, the phone numbers and Twilio credentials to this file. Here’s an example of what this file should look like:

```json
{
  "twilio": {
    "twilio_account_sid": "12345678",
    "twilio_auth_token": "12345678",
    "twilio_number": "+420123456"
  },
  "hard_working_user@gmail.com": "+3333333",
  "lazy_user@gmail.com": "+2222222",
  "user_who_breaks_the_build@renderedtext.com": "+1111111"
}
```

Go to the [AWS S3 console](https://console.aws.amazon.com/s3/) and upload the `numbers.json` to a bucket of your choice.

## Defining Dependencies

Next, we will define the dependencies that we are using in our Node.js application in `package.json`. This file should look similar to the following:

```json
{
  "name": "congrats-you-broke-the-build",
  "version": "0.0.1",
  "main": "index.js",
  "devDependencies": {
    "aws-sdk": "2.0.23"
  },
  "dependencies": {
    "twilio": "2.1.0"
  }
}
```

## Installing Grunt CLI

We will also need to install Grunt in order to test our function. Grunt is a task runner for JavaScript, which is used for easy automation of project tasks such as building and packaging. Install it with the following code:

```bash
$ sudo npm install -g grunt-cli
```

If you’re having trouble with installing Grunt, you can find more information on the [NPM Grunt page](https://www.npmjs.com/package/grunt-cli).

## Defining the Lambda Function Logic

Now that we have uploaded `numbers.json` to S3 and installed Grunt CLI, we can implement some code. When we invoke our Lambda function, `exports.handler` will handle the request that invoked it. The event parameter is the JSON file that was included in the request sent to our Lambda function.

We need to create a file named `index.js` to hold our Lambda function logic. First, let’s fetch `numbers.json` from S3 using the following code segment:

```javascript
var AWS = require("aws-sdk")

exports.handler = function (event, context) {
  console.log("JSON API from Semaphore: %j", event)

  AWS.config.apiVersions = {
    s3: "2006-03-01",
  }

  // My bucket with numbers.json is located in 'us-west-2' region
  var s3 = new AWS.S3({ region: "us-west-2" })
  // This is where you define bucket and a file for S3 to get
  var params = { Bucket: "congrats-you-broke-the-build", Key: "numbers.json" }

  s3.getObject(params, function (err, data) {
    if (err) console.log(err, err.stack) // an error has happened on AWS

    // Parse JSON file and put it in numbers variable
    var numbers = JSON.parse(data.Body)
  })
}
```

Now that we have parsed our JSON file, it’s time do something with those numbers. We will add a new function called `manipulateNumbers` to our code. This function will receive numbers from our `numbers.json` file.

```javascript
var AWS = require("aws-sdk")

exports.handler = function (event, context) {
  console.log("JSON API from Semaphore: %j", event)

  AWS.config.apiVersions = {
    s3: "2006-03-01",
  }

  // My bucket with numbers.json is located in 'us-west-2' region
  var s3 = new AWS.S3({ region: "us-west-2" })
  // This is where you define the location of the bucket and the file S3 needs to retrieve
  var params = { Bucket: "congrats-you-broke-the-build", Key: "numbers.json" }

  s3.getObject(params, function (err, data) {
    if (err) console.log(err, err.stack) // an error has happened on AWS

    // Parse JSON file and put it in numbers variable
    var numbers = JSON.parse(data.Body)

    manipulateNumbers(numbers)
  })

  function manipulateNumbers(numbers) {
    // If someone breaks the master build on Semaphore, get inside the if statement
    if (event.branch_name == "master" && event.result == "failed") {
      // We get the name of a user who broke the build
      var blame = event.commit.author_name

      // message that is sent to the developer who broke the master branch
      var message =
        "Congrats " +
        blame +
        ", you managed to break the master branch on SemaphoreCI!."
    }
  }
}
```

This function checks if the `branch_name` is `master` and if the build has failed. It includes the message that will be sent to the user who broke the build.

We now have the message we will send to the user, but we still need to write the code that will send it:

```javascript
var AWS = require("aws-sdk")
var twilio = require("twilio")

exports.handler = function (event, context) {
  console.log("JSON API from Semaphore: %j", event)

  AWS.config.apiVersions = {
    s3: "2006-03-01",
  }

  // My bucket with numbers.json is located in the 'us-west-2' region
  var s3 = new AWS.S3({ region: "us-west-2" })
  // This is where you define the location of the bucket and the file S3 needs to retrieve
  var params = { Bucket: "congrats-you-broke-the-build", Key: "numbers.json" }

  s3.getObject(params, function (err, data) {
    if (err) console.log(err, err.stack) // an error has happened on AWS

    // Parse JSON file and put it in numbers variable
    var numbers = JSON.parse(data.Body)

    manipulateNumbers(numbers)
  })

  function manipulateNumbers(numbers) {
    // If someone breaks the master build on Semaphore, enter the if statement
    if (event.branch_name == "master" && event.result == "failed") {
      // We get the name of the user who broke a build
      var blame = event.commit.author_name

      // The message that is sent to the developer who broke the master branch
      var message =
        "Congrats " +
        blame +
        ", you managed to brake master branch on SemaphoreCI!."

      twilioHandler(numbers, message)
    }
  }

  function twilioHandler(numbers, message) {
    var blame_mail = event.commit.author_email
    // twilio credentials
    var twilio_account_sid = numbers.twilio.twilio_account_sid
    var twilio_auth_token = numbers.twilio.twilio_auth_token
    var twilio_number = numbers.twilio.twilio_number

    var client = twilio(twilio_account_sid, twilio_auth_token)

    // Send SMS
    client.sendSms(
      {
        to: numbers[blame_mail],
        from: twilio_number,
        body: message,
      },
      function (err, responseData) {
        // this function is executed when a response is received from Twilio
        if (!err) {
          console.log(responseData)
          context.done(null, "Message sent to " + numbers[blame_mail] + "!")
        } else {
          console.log(err)
          context.done(null, "There was an error, message not sent!")
        }
      }
    )
  }
}
```

We requested a Twilio package, which we will use to send the message. We also added the `twilioHandler` function. This function creates a Twilio client and extracts the phone number from the `numbers` variable based on `author_email` from `event`. After it’s done retrieving the data needed for sending the text message, it calls `client.sendSms()`, which sends the text message to the user who broke the build.

Now we’re ready to test the function.

## Testing the Function Locally

Let’s create a `event.json` file, so we can test our function locally. We will try to mimic the JSON that Semaphore API will send us. In that file, we will set `branch_name` to `master` and the `result` of the build to `failed`. This is the scenario that will trigger sending an SMS to the user who breaks the master branch.

```json
{
  "branch_name": "master",
  "result": "failed",
  "commit": {
    "id": "ce03782d581ed985caf9c479173a14962b0fe941",
    "url": "https://github.com/lazy_user//commit/ce03782d581ed985caf9c479173a14962b0fe941",
    "author_name": "Lazy user",
    "author_email": "lazy_user@gmail.com",
    "message": "Add index.js",
    "timestamp": "2015-12-07T11:31:38+01:00"
  }
}
```

Next, we will create `Gruntfile.js` so we can invoke our Lambda function locally.

```javascript
var grunt = require("grunt")
grunt.loadNpmTasks("grunt-aws-lambda")

grunt.initConfig({
  lambda_invoke: {
    default: {},
  },
})
```

We’re now ready to test our function. Run:

```bash
$ npm install
```

When the NPM package installation finishes, we can invoke our Lambda function by executing the following line:

```bash
$ grunt lambda_invoke
```

The output should look similar to this:

```bash
Success!  Message:
------------------
Message sent to +2222222!
```

## Deploying a Lambda Function

Now that we’ve developed the Lambda function and tested it locally, it’s time to deploy it to the internet.

## Pushing the Code to GitHub

To integrate the code with Semaphore, we need to first push it to GitHub. You can find detailed instructions on how to do that in [GitHub’s documentation](https://help.github.com/articles/adding-a-file-to-a-repository-from-the-command-line/)

## Building the Project on Semaphore

Now that we’ve pushed our code to GitHub, we can add the project from GitHub to [Semaphore](https://semaphoreci.com/).

Once the analysis is done and you have the build commands in front of you, you can click on _Build With These Settings_. The build should pass, and you should a page that looks like this:

## Setting Up Deployment to AWS Lambda

To set up deployment, you need to go to your project page on [Semaphore](https://semaphoreci.com/) and click on _Set Up Deployment_. You will get a screen with different deployment options. We will choose AWS Lambda.

### Selecting the Deployment Method

There are two deployment methods available on Semaphore: _automatic_ and _manual_ deployment.

**Automatic** deployment means that a deploy will be triggered after every passed build on the selected branch. In addition, you can also manually deploy any build from any branch at any time.

For automatic deployment, you will be asked to select which branch will be automatically deployed after each passed build.

**Manual** deployment requires the manual selection of the builds to deploy.

We will choose Automatic deployment.

**Note**: You can change the deployment strategy at any time in server settings once the setup is complete.

### Selecting the Branch

In this step, we will choose from which branch we wish to deploy the application. We’ll select the master branch.

### Entering the AWS Credentials

Next, enter your AWS credentials on the following screen. If you need help getting these credentials, consult the _Retrieving Security Credentials_ section of our tutorial on deploying a web application to Elastic Beanstalk. The process for retrieving credentials is the same when deploying to Lambda.

After entering the credentials, select the region your application resides in on the same screen. This will enable Semaphore to list the functions you have in the region you have specified.

### Selecting the Function

The next step is to select the function to which we will deploy our code. We’ll select `congrats-you-broke-the-build`. Next, type `npm install` in the dependencies installation commands section. This will install the packages we are using in our application, so that they are deployed to Lambda.

### Naming the Server on Semaphore

In this step, you need to provide a name for your server. This name will be used on your Semaphore dashboard and deployment timeline.

The setup is now complete — you are ready to automatically deploy to Lambda. All you need to do is click on _Deploy_.

## Testing the Function on AWS Lambda

You can now go to your [Lambda function](https://us-west-2.console.aws.amazon.com/lambda/) to test it. Click on _Actions_ and select _Configure test event_.

Copy the contents of `event.json` to the _Input test event_ editor. Enter the email address and phone number you defined in your `numbers.json` in order to be able to receive a message.

Click on _Save and test_. Congrats, you managed to test your first AWS Lambda function.

## Enabling Notifications

Next, we will tell Semaphore to send a POST request to our Lambda function every time a build is finished. Let’s make an Amazon API Gateway for our Lambda functions. Go to the _API endpoints tab_ of the [Lambda function](https://us-west-2.console.aws.amazon.com/lambda/) and click on _Add API endpoint_. The configuration should look as follows:

Click on _Submit_ and copy the _API endpoint URL_. We will need this URL to add a webhook to Semaphore.

Now, go to your project settings on [Semaphore](https://semaphoreci.com/). Click on _Notifications_, and then on _Webhooks_. Click on _Add Webhook_ and paste the link you copied from Lambda to the URL text field. Your screen should look similar to this:

Click on _Test_. This will send a test request to the API end point that you copied. Next, go to the _Monitoring_ page on AWS Lambda and click on _View logs in CloudWatch_, where you can see that the function has been invoked.

## Breaking the Build

Let’s see if this works in a real test case scenario. For this purpose, we will break a build on Semaphore. Go to your project settings, click on _Build Settings_ and add a new command line to any thread:

```bash
$ false
```

just to see how it breaks. Now click on _Start_. Your build should fail, and this will cause a request to be sent to your Lambda function. All that’s left to do is to wait for the text message to arrive on your phone.

Congrats, you’ve managed to successfully develop, test and deploy your first Lambda function through Semaphore!

_The code from this tutorial is available in this [GitHub repository](https://github.com/nikolalsvk/congrats-you-broke-the-build)._
