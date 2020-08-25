exports.handler = function(context, event, callback) {
    let memory = JSON.parse(event.Memory);
    let answers = memory.twilio.collected_data.confirm.answers;
    let yes_no_confirm = answers.yes_no_confirm.answer;
    
    let visit = `visit https://${context.SERVERLESS_ID}.twil.io/donate.html?donor=${memory.donor_key}`
    let assist = "Text2Alms is an nascent non-proift by Russ Fugal. \
                  Reply with your name and email or phone number if you'd like to contribute with your talent or resources.";
    
    if (yes_no_confirm == "Yes") {
        callback(null, {"actions":[
            {"say": `Thank you! To make the payment, ${visit}`},
            {"say": assist}
        ]});
    } else {
        callback(null, {"actions":[
            {"say":`OK. If you change your mind, ${visit}`},
            {"say":memory.demo_followup}
        ]});
    }
};