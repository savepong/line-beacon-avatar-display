const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 0. npm install axios
// 1. Import template and util
// const template = require('./template');
const util = require('./util');
// 2. Fill in your CHANNEL ACCESS TOKEN in util.js

exports.myWebhook = functions.https.onRequest(async (request, response) => {
  const events = request.body.events;

  for (const event of events) {

    // 3. Detect beacon event
    if (event.type === "beacon") {
      // 4. Log body payload

      // 5. Get userId
      const userId = event.source.userId;
      
      // 6. Get user profile
      const profile = await util.getUserProfile(userId);
      
      // 7. Detect beacon type
      switch (event.beacon.type) {
        // 8. If beacon type is enter then reply with Flex message
        case "enter":
          // let msg = template.enter1(profile);
          let msg = {
            "type": "text",
            "text": "Hello, party"
          }
          await util.reply(event.replyToken, msg);
          await util.addBeaconUser(profile);
          break;
        // 9. Replying personal messages separated by each device

        // 10. Create a Rich Menu then fill in your RICH MENU ID in util.js
        // 11. If beacon type is banner then link a personal Rich Menu to user

        // 12. If beacon type is stay then write user profile to database
      }
    }
  }

  response.end();
});
