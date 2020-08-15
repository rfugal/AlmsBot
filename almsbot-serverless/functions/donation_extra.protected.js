exports.handler = function(context, event, callback) {
    let memory = JSON.parse(event.Memory);
    almsperson = memory.almsperson; // TODO: redirect if no almsperson
    give_amount = memory.give_amount;
    demo_followup = memory.demo_followup;
    processing_fee = memory.processing_fee;
    extra_amount = (give_amount * 0.25).toFixed(2);
    let answers = memory.twilio.collected_data.extras.answers;
    yes_no_fee = answers.yes_no_fee.answer;
    if (yes_no_fee == "Yes") {
        message_end = ` and $${processing_fee} to cover processing.`;
    } else { message_end = "."; }
    message = `Ok, you want to give $${give_amount} to ${almsperson}` + message_end;
    let responseObject = {
        "actions": [
            {
                "remember": {
                    "almsperson": almsperson,
                    "give_amount": give_amount,
                    "processing_fee": processing_fee,
                    "extra_amount": extra_amount,
                    "yes_no_fee": yes_no_fee,
                    "demo_followup": demo_followup
                }
            },
            {
                "collect": {
                    "name": "extras",
                    "questions": [
                        {
                            "question": `Will you give an extra $${extra_amount} for programs for the unhoused and hungry?`,
                            "name": "yes_no_extra",
                            "type": "Twilio.YES_NO"
                        }
                    ],
                    "on_complete": {
                        "redirect": "https://almsbot-serverless-xxxx-prod.twil.io/process_donation"
                    }
                }
            }
        ]
    };
    callback(null, responseObject);
};