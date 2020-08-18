exports.handler = function(context, event, callback) {
    almsperson = event.Field_almsperson_Value;
    story = "Homeless and Hungry, Will Accept Donation. \nhttps://www.sfgate.com/bayarea/article/The-city-s-panhandlers-tell-their-own-stories-4929388.php";
    demo_followup = "Text2Alms is an nascent non-proift by Russ Fugal. Reply with your name and email or phone number if you'd like to contribute with your talent or resources.";
    'Field_dollars_Value' in event ? give_amount = event.Field_dollars_Value : give_amount = 20;
    if (almsperson == "Bambie") {
        story = "Bambie has a rare genetic disease that led to the amputation of both her legs. An almswoman in a wheelchair, she receives $80 to $150 a day.";
        demo_followup = "Try texting: \n\"I need help\" \n\"Kirk\" \nor \"give\"";
    }
    let responseObject = {
        "actions": [
            {
                "remember": {
                    "almsperson": almsperson,
                    "give_amount": give_amount,
                    "demo_followup": demo_followup
                }
            },
            {
                "say": story
            },
            {
                "say": `Thank you for asking about ${almsperson}. 
                        \n\nThis is a demontration, try it out (no payments processed):
                        \nCan you give $${give_amount} today? 
                        \n(Your entire donation goes to ${almsperson} as cash)`
            },
            {
                "listen": {
                    "tasks": [
                        "give_amount",
                    ]
                }
            }
        ]
    }
    callback(null, responseObject);
};