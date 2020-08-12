exports.handler = function(context, event, callback) {
    reply1 = "Homeless and Hungry, Will Accept Donation. \nhttps://www.sfgate.com/bayarea/article/The-city-s-panhandlers-tell-their-own-stories-4929388.php"
    reply2 = "Text2Alms is an nascent non-proift by Russ Fugal. Reply with your name and email or phone number if you'd like to contribute with your talent or resources."
    if (event.Field_almsperson_Value.toLowerCase() == "bambie") {
        reply1 = "Bambie has a rare genetic disease that led to the amputation of both her legs. An almswoman in a wheelchair, she receives $80 to $150 a day."
        reply2 = "Try texting: \n\"I need help\" \n\"Kirk\" \nor \"give\""
    }
    let responseObject = {
        "actions": [
            {
                "say": reply1
            },
            {
                "say": reply2
            }
        ]
    }
    callback(null, responseObject);
};