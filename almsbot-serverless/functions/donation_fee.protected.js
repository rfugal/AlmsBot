exports.handler = function(context, event, callback) {
    let memory = JSON.parse(event.Memory);
    if (event.CurrentTaskConfidence < 0.7 || !('almsperson' in memory)) {
        callback(null, {"actions": [{"redirect": "task://greeting"}]});
    }
    let almsperson = memory.almsperson;
    let yes_no_give = "No";
    if ('Field_give_amount_Value' in event) {
        give_amount = event.Field_give_amount_Value;
        yes_no_give = "Yes";
    } else if ('twilio' in memory && 'collect_amount' in memory) {
        give_amount = memory.twilio.collected_data.give_amount.answers.give_amount.answer;
        yes_no_give = "Yes";
    } else {
        give_amount = memory.give_amount;
        if ('Field_yes_no_give_Value' in event) {
            yes_no_give = event.Field_yes_no_give_Value;
        }
    }
    if (yes_no_give == "No") {
        let responseObject = {
            "actions": [
                {
                    "remember": {
                        "almsperson": almsperson,
                        "demo_followup": demo_followup,
                        "collect_amount": true
                    }
                },
                {
                    "collect": {
                        "name": "give_amount",
                        "questions": [
                            {
                                "question": `How much would you give to ${almsperson}?`,
                                "name": "give_amount",
                                "type": "Twilio.NUMBER"
                            }
                        ],
                        "on_complete": {
                            "redirect": `https://${context.SERVERLESS_ID}.twil.io/donation_fee`
                        }
                    }
                }
            ]
        };
        callback(null, responseObject);
    }
    give_amount = parseFloat(give_amount);
    if (give_amount <= 0) {
        let responseObject = {"actions": [{"redirect": "task://greeting"}]};
        callback(null, responseObject);
    }
    demo_followup = memory.demo_followup;
    // processing fees include squareup non-profit rates and twilio messaging fees plus $0.15
    processing_fee = ( (give_amount*0.026) + 0.10 + (0.0075*20) + 0.03 + 0.15).toFixed(2);
    give_amount = give_amount.toFixed(2);
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
                        "redirect": `https://${context.SERVERLESS_ID}.twil.io/donation_extra`
                    }
                }
            }
        ]
    };
    callback(null, responseObject);
};