exports.handler = function(context, event, callback) {
    const ASSIST_OFFERS_SID = context.ASSIST_OFFERS_SID;
    const SERVICE_SID = context.SYNC_SERVICE_SID;
    let memory = JSON.parse(event.Memory);
    
    const intakeContact = {
        message: memory.CurrentInput,
        From: event.UserIdentifier
    };
    
    // Create a sync list item for the order
    const twilioClient = context.getTwilioClient();
    twilioClient.sync
        .services(SERVICE_SID)
        .syncLists(ASSIST_OFFERS_SID)
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