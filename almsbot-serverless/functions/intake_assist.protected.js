exports.handler = function(context, event, callback) {
    const ASSIST_OFFERS = context.ASSIST_OFFERS_SID;
    const SERVICE_SID = context.SYNC_SERVICE_SID;
    
    const intakeContact = {
        memory: event.Meory,
        first_name: event.Field_first_name_Value,
        last_name: event.Field_last_name_Value,
        email: event.Field_email_Value,
        phone_number: event.Field_phone_number_Value,
        message: event.CurrentInput,
        UserIdentifier: event.UserIdentifier,
        Channel: event.Channel
    };
    
    // Create a sync list item for the order
    const twilioClient = context.getTwilioClient();
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
};