exports.handler = function(context, event, callback) {
    let memory = JSON.parse(event.Memory);
    almsperson = memory.almsperson; // TODO: redirect if no almsperson
    if ('Field_give_amount_Value' in event) {
        give_amount = event.Field_give_amount_Value;
    } else {
        give_amount = memory.give_amount;
    }
    if ('Field_yes_no_give_Value' in event) {
        yes_no_give = event.Field_yes_no_give_Value;
        // if (yes_no_give == "No") {} // TODO: ask for value
    }
    demo_followup = memory.demo_followup;
    processing_fee = (give_amount * 0.03 + 0.35).toFixed(2);
    let responseObject = {
        "actions": [
            {
                "remember": {
                    "almsperson": almsperson,
                    "give_amount": give_amount,
                    "processing_fee": processing_fee,
                    "demo_followup": demo_followup
                }
            },
            {
                "collect": {
                    "name": "extras",
                    "questions": [
                        {
                            "question": `Great! Will you give an extra $${processing_fee} to cover third-party payment processing fees?`,
                            "name": "yes_no_fee",
                            "type": "Twilio.YES_NO"
                        }
                    ],
                    "on_complete": {
                        "redirect": "https://almsbot-serverless-xxxx-prod.twil.io/donation_extra"
                    }
                }
            }
        ]
    };
    callback(null, responseObject);
};