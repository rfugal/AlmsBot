exports.handler = function(context, event, callback) {
    const ASSIST_OFFERS = context.ASSIST_OFFERS;
    const SERVICE_SID = context.SYNC_SERVICE_SID;

    const intakeContact = {
        memory: event.Memory,
        first_name: event.Field_first_name_Value,
        last_name: event.Field_last_name_Value,
        email: event.Field_email_Value,
        phone_number: event.Field_phone_number_Value,
        message: event.CurrentInput,
        UserIdentifier: event.UserIdentifier,
        Channel: event.Channel
    };
    message = `New volunteer— \n${intakeContact.UserIdentifier} \n${intakeContact.message}`

    const twilioClient = context.getTwilioClient();
    twilioClient.messages.create({
        to: context.NOTIFICATION_PHONE_NUMBER,
        from: context.ALMSBOT_PHONE_NUMBER,
        body: message
    }).then(msg => {
        // Create a sync list item for the order
        twilioClient.sync
        .services(SERVICE_SID)
        .syncLists(ASSIST_OFFERS)
        .syncListItems.create({ data: intakeContact })
        .then(x => {
            let responseObject = {
                "actions": [
                    {
                        "say": "Thank you, and God bless. \
                                \n\nLuke 12:33 — \nSell that ye have, and give alms. \
                                \nhttps://www.biblegateway.com/passage/?search=Luke+12%3A33&version=KJV"
                    }
                ]
            }
            callback(null, responseObject);
        })
        .catch(err => {
            callback(err); 
            console.log(err);
        });
    });
};