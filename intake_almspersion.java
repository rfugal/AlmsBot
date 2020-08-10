exports.handler = function(context, event, callback) {
    let memory = JSON.parse(event.Memory);
    let answers = memory.twilio.collected_data.intake_contact.answers;
    
    const ALMSPERSONS = 'almspersons';
    const SERVICE_SID = context.SYNC_ALMSPERSON_SID;
    
    const intakeContact = {
        first_name: answers.first_name.answer,
        text_able: answers.text_able.answer,
        voice_able: answers.voice_able.answer,
        connect_hour: answers.connect_hour.answer,
        city: answers.city.answer,
        comments: answers.comments.answer,
        from: event.UserIdentifier,
        channel: event.Channel
    };
    
    // Create a sync list item for the order
    const twilioClient = context.getTwilioClient();
    twilioClient.sync
        .services(SERVICE_SID)
        .syncLists(ALMSPERSONS)
        .syncListItems.create({ data: intakeContact })
        .then(x => {
            callback(null, undefined);
        
        })
        .catch(err => callback(err));

    console.log(memory.twilio.chat.From);

    first_name = answers.first_name.answer;
    let message = "One of our advocates will be in touch with you soon, " + first_name + ". God bless.";
    
    let responseObject = {
        "actions": [
            {
                "say": message
            }
        ]
    }
    
    callback(null, responseObject);
};