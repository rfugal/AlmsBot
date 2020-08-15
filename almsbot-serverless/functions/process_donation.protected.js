exports.handler = function(context, event, callback) {
    let memory = JSON.parse(event.Memory);
    demo_followup = memory.demo_followup;
    almsperson = memory.almsperson; // TODO: redirect if no almsperson
    give_amount = memory.give_amount;
    processing_fee = memory.processing_fee;
    extra_amount = memory.extra_amount;
    let answers = memory.twilio.collected_data.extras.answers;
    yes_no_fee = answers.yes_no_fee.answer;
    yes_no_extra = answers.yes_no_extra.answer;
    message_end = "?";
    if (yes_no_extra == "Yes") {
        message_end = ` and $${extra_amount} extra for programing${message_end}`;
    }
    if (yes_no_fee == "Yes") {
        message_end = ` and $${processing_fee} to cover processing${message_end}`;
    }
    message = `Ok, you want to give $${give_amount} to ${almsperson}${message_end}`;
    let responseObject = {
        "actions": [
            {
                "say": message
            },
            {
                "say": demo_followup
            }
        ]
    };
    callback(null, responseObject);
};