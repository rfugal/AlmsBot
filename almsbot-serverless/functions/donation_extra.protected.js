exports.handler = function(context, event, callback) {
    let memory = JSON.parse(event.Memory);
    let almsperson = memory.almsperson;
    let give_amount = memory.give_amount;
    let processing_fee = memory.processing_fee;
    let extra_amount = (give_amount * 0.25).toFixed(2);
    let answers = memory.twilio.collected_data.extras.answers;
    let yes_no_fee = answers.yes_no_fee.answer;
    if (yes_no_fee == "Yes") {
        message_end = ` and $${processing_fee} to cover processing.`;
    } else { message_end = "."; }
    let message = `Ok, you want to give $${give_amount} to ${almsperson}` + message_end;
    let responseObject = {
        "actions": [
            {
                "remember": {
                    "almsperson": almsperson,
                    "give_amount": give_amount,
                    "processing_fee": processing_fee,
                    "extra_amount": extra_amount,
                    "yes_no_fee": yes_no_fee,
                    "demo_followup": memory.demo_followup
                }
            },
            {
                "collect": {
                    "name": "extras",
                    "questions": [
                        {
                            "question": `Will you give an extra $${extra_amount} for programs for the unhoused, the hungry, and the sick?`,
                            "name": "yes_no_extra",
                            "type": "Twilio.YES_NO"
                        }
                    ],
                    "on_complete": {
                        "redirect": `https://${context.SERVERLESS_ID}.twil.io/confirm_donation`
                    }
                }
            }
        ]
    };
    callback(null, responseObject);
};