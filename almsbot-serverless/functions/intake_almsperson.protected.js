exports.handler = function(context, event, callback) {
    let memory = JSON.parse(event.Memory);
    let answers = memory.twilio.collected_data.intake_contact.answers;
    
    const ALMSPERSONS = context.ALMSPERSONS;
    const SERVICE_SID = context.SYNC_SERVICE_SID;
    
    const intakeContact = {
        first_name: answers.first_name.answer,
        text_able: answers.text_able.answer,
        voice_able: answers.voice_able.answer,
        connect_hour: answers.connect_hour.answer,
        city: answers.city.answer,
        comments: answers.comments.answer,
        From: event.UserIdentifier,
        channel: event.Channel
    };
    if ('english_ok' in answers) {intakeContact.english_ok = answers.english_ok.answer;}
    message = `New almsperson— \n${intakeContact.UserIdentifier} \n${intakeContact.first_name} 
            \nText? ${intakeContact.text_able} \nCall? ${intakeContact.voice_able} \n${intakeContact.connect_hour} 
            \n${intakeContact.city} \n${intakeContact.comments} `;
    
    if ('english_ok' in intakeContact) {
        message = message + `\nenglish? ${intakeContact.english_ok} `;
    }
    
    const twilioClient = context.getTwilioClient();
    twilioClient.messages.create({
        to: context.NOTIFICATION_PHONE_NUMBER,
        from: context.ALMSBOT_PHONE_NUMBER,
        body: message
    }).then(msg => {
        // Create a sync list item for the order
        const twilioClient = context.getTwilioClient();
        twilioClient.sync
        .services(SERVICE_SID)
        .syncLists(ALMSPERSONS)
        .syncListItems.create({ data: intakeContact })
        .then(x => {
            console.log('success!');
            let message = `One of our advocates will be in touch with you soon, ${answers.first_name.answer}. God bless.`;
            let responseObject = {
                "actions": [
                    {
                        "say": message
                    }
                ]
            };
            callback(null, responseObject);
        })
        .catch(err => {
            callback(err); 
            console.log(err);
        });
    });
};