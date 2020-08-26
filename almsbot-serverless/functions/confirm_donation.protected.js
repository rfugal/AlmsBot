const crypto = require('crypto');
exports.handler = function(context, event, callback) {
    const SERVICE_SID = context.SYNC_SERVICE_SID;
    const PAYMENT_ID_MAP = context.PAYMENT_ID_MAP;
    let memory = JSON.parse(event.Memory);
    let almsperson = memory.almsperson;
    let give_amount = memory.give_amount;
    let processing_fee = memory.processing_fee;
    let extra_amount = memory.extra_amount;
    let answers = memory.twilio.collected_data.extras.answers;
    let yes_no_fee = answers.yes_no_fee.answer;
    let yes_no_extra = answers.yes_no_extra.answer;
    let data = {
        almsperson: almsperson,
        give_amount: give_amount,
        demo_followup: memory.demo_followup,
        donor: event.UserIdentifier
    }
    let message_end = "?";
    let total_amount = parseFloat(give_amount);
    if (yes_no_extra == "Yes") {
        message_end = ` and $${extra_amount} extra for programing${message_end}`;
        total_amount += parseFloat(extra_amount);
        data.extra_amount = extra_amount;
    }
    if (yes_no_fee == "Yes") {
        message_end = ` and $${processing_fee} to cover processing${message_end}`;
        total_amount += parseFloat(processing_fee);
        data.processing_fee = processing_fee;
    }
    data.full_amount = (total_amount*100).toFixed(0);
    data.message = `Ok, you want to give $${give_amount} to ${almsperson}${message_end}`;
    item = {}
    item.key = crypto.randomBytes(8).toString('hex');
    item.data = data;
    item.ttl = 172800;

    const twilioClient = context.getTwilioClient();
    twilioClient.sync
    .services(SERVICE_SID)
    .syncMaps(PAYMENT_ID_MAP)
    .syncMapItems.create(item)
    .then( function() {
        callback(null, {"actions": [{"collect": {
            "name": "confirm",
            "questions": [
                {
                    "question": data.message,
                    "name": "yes_no_confirm",
                    "type": "Twilio.YES_NO"
                }
            ],
            "on_complete": {
                "redirect": `https://${context.SERVERLESS_ID}.twil.io/process_donation`
            }
          }},{"remember": {
            "demo_followup": memory.demo_followup,
            "donor_key": item.key,
            "almsperson": almsperson
        }}]});
    }).catch(function(err) {
        console.error(err);
        callback(err);
    });
};