## Alexa Skill (Node and DynamoDb)

###Configuration

####Developer Console

Create a new skill and copy/paste ```docs/intentBuilder.json``` into the Code Editor tab.


####DynamoDB

Create a new table, then import ```docs/dynamodb-data.csv``` to seed it with some test data.


####Code Parameters

Open ```index.js``` and add your skill ID and DynamoDb table name (near the top of the file).

You can find your skill ID in the Amazon developer console. Open your skill and look for ```Application ID``` in the Skills Information tab.

###Installing

Create zip of code repository with the following CLI command run from the root directory:

```
$ cd folder; zip -r ../zipped_dir.zip *
```

####Lambda Function

Create a Lambda Function and set Alexa Skills Kit as the trigger.  

Select ```Node.js 6.10``` in the Runtime drop down field.

Upload the zip folder to your function. It's too big for inline editing so you'll need to work in an IDE and continually re-zip your code and upload in this way as you work on the skill.

Make sure your Lambda Function has a role assigned with permissions to query DynamoDB and log to CloudWatch.

###Debugging

To debug your skill, access your Lambda function > Monitoring > Invocation Errors and click 'Jump to logs' which will take you to the CloudWatch log for your function. Here you will see a full stack trace and any messages you log to your console in the code.

###Useful Reading

I shamelessly hacked this together through trial and error after reading [this blog post](https://codeburst.io/how-to-create-an-alexa-skill-with-node-js-and-dynamodb-3c9d5e9661) and looking at [this code](https://github.com/alexa/alexa-cookbook/blob/master/aws/Amazon-DynamoDB/read/src/index.js).