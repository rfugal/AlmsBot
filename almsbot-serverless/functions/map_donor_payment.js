exports.handler = function(context, event, callback) {
    const SERVICE_SID = context.SYNC_SERVICE_SID;
    const PAYMENT_ID_MAP = context.PAYMENT_ID_MAP;
    const twilioClient = context.getTwilioClient();
    twilioClient.sync
        .services(SERVICE_SID)
        .syncMaps(PAYMENT_ID_MAP)
        .syncMapItems.get(event.donor)
        .fetch().then( function(item) {
            callback(null, item);
        });
}