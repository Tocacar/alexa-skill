const alexaSDK = require('alexa-sdk');
const awsSDK = require('aws-sdk');
const docClient = new awsSDK.DynamoDB.DocumentClient();

const appId = 'ADD YOUR SKILL ID HERE';
const dbTable = 'ADD YOUR DYNAMO TABLE NAME HERE';

const launchMessage = 'Hi, I\'m your friendly Health Bot. I know a thing or two about human diseases. You can ask me to tell you about a disease and I will share what I know.';

var handlers = {
    /**
     * Trigger when user says Alexa open Health Bot
     */
    'LaunchRequest' () {
        this.emit(':ask', launchMessage);
    },
    /**
     * Reads a fact from the database
     */
    'GetNewFactIntent' () {

        var intent = this.event.request.intent;
        var slots = intent.slots;

        console.log('slots are:');
        console.log(slots);

        // prompt for slot data if needed
        if (!slots.criteria.value) {
            const slotToElicit = 'criteria';
            const speechOutput = 'What would you like to know?';
            const repromptSpeech = 'What can I tell you about?';
            return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
        }

        var criteria = slots.criteria.value;

        console.log('Search criteria is:');
        console.log(criteria);

        var params = {
            TableName: dbTable,
            Key: {
                FactId: criteria
            }
        };

        console.log('params are:');
        console.log(params);

        dynamoGet(params, result => {

            console.log('result is:');
            console.log(result);

            var say = 'You asked me about ' + criteria + '. Here\'s what I know. ' + result.Disease + '. What else would you like to know?';
            this.response.speak(say).listen('Sorry, that didn\'t work, please try again.');
            this.emit(':responseReady');
        });
    },
    /**
     * Unhandled intent, triggered if user asks unrecognised question
     */
    'Unhandled' () {
        console.error('problem', this.event);
        this.emit(':ask', 'An unhandled problem occurred!');
    },
    /**
     * Default Help intent
     */
    'AMAZON.HelpIntent' () {
        this.emit(':ask', 'Ask me to tell you about something or someone, please try again');
    },
    /**
     * Default Cancel intent
     */
    'AMAZON.CancelIntent' () {
        this.emit(':tell', 'OK, I am cancelling. Goodbye');
    },
    /**
     * Deafult Stop intent
     */
    'AMAZON.StopIntent' () {
        this.emit(':tell', 'OK, I am stopping. Goodbye');
    }
};


//  helper functions  ===================================================================


/**
 * Reads from dynamoDB
 *
 * @param params
 * @param callback
 */
function dynamoGet(params, callback) {

    console.log('reading DynamoDB table');

    docClient.get(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            callback(data.Item);
        }
    });
}

/**
 * Export handler function to run the skill
 *
 * @param event
 * @param context
 */
exports.handler = function handler(event, context) {
    const alexa = alexaSDK.handler(event, context);
    alexa.appId = appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};