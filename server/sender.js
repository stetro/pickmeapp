var gcm = require('node-gcm');

// create a message with default values
var message = new gcm.Message();

// or with object values
var message = new gcm.Message({
    collapseKey: 'newdemotest',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
        key1: 'message1',
        key2: 'message2'
    }
});

var sender = new gcm.Sender('AIzaSyBcG_V2Aen_fw03WlMZqAo_SgFCpHIwd6U');
var registrationIds = ['APA91bGNCMd72Rsm7pGctv3wwrBGpgbOTeM02WXkO5xqhV44fIIzR1JdksK0xIjB8QDa6bzReb47Aw4a6eE8IY_pcmGFoyuMwR-Dbw8-TsbpX_uFbXPpG56RSdGx65Duu7aEmrpSC8bZ25c11X3M-iazzP-CeLk7zxqWc1mlG094xJb6SKA8uGg'];


// At least one required

/**
 * Params: message-literal, registrationIds-array, No. of retries, callback-function
 **/
sender.send(message, registrationIds, 4, function(err, result) {
    console.log(result);
});
