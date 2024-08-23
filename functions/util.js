const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require('axios');

// 2. Fill in your CHANNEL ACCESS TOKEN
const CHANNEL_ACCESS_TOKEN = "Apu+1LfQZvpVf6ysw74kc3S20jQBRSKFqZSIYauFqvGgO1VPP8kv0EGgq+0Ffb6wXuMw7ShgwLLl+39DvUVh1LNfcX5o585dlLvzd3/f4fdFgOA++eFjx3n3goilKQ5tzWrtdFicTDZp9FLtPx4RtgdB04t89/1O/w1cDnyilFU=";
// const CHANNEL_ACCESS_TOKEN = "uu41kxz12H8Aw7zExmjvoIHzaqKHdPYwOuIoPyFuFM5GwiQRu0hjVvP0qQKGPTQRgRiYpe3OTb9QO1kwSX7nyB2J6fPrdorPEcpK/IVg7iqgkAT2aL9EdtNsY8Z5VOFpbPifWiSiOyBHejtu21G/RAdB04t89/1O/w1cDnyilFU=";

const LINE_MESSAGING_API = "https://api.line.me/v2/bot";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
};

class Utils {
  async getUserProfile(userId) {
    try {
      const profile = await axios({
        method: 'get',
        url: `${LINE_MESSAGING_API}/profile/${userId}`,
        headers: LINE_HEADER
      })
      return profile.data
    } catch (error) {
      functions.logger.error('Utils-getUserProfile', error.message)
      return null
    }
  }

  async reply(token, payload) {
    try {
      await axios({
        method: 'post',
        url: `${LINE_MESSAGING_API}/message/reply`,
        headers: LINE_HEADER,
        data: {
          replyToken: token,
          messages: payload
        }
      })
      return true;
    } catch (error) {
      functions.logger.error('Utils-reply', error.message);
      return false;
    }
  }

  async richMenuLink(userId) {
    // 10. Fill in your RICH MENU ID
    const RICH_MENU_ID = "";
    try {
      await axios({
        method: "post",
        url: `${LINE_MESSAGING_API}/user/${userId}/richmenu/${RICH_MENU_ID}`,
        headers: LINE_HEADER
      });
      return true;
    } catch (error) {
      functions.logger.error('Utils-richMenuLink', error.message);
      return false;
    }
  }

  async addBeaconUser(profile) {
    const userRef = admin.firestore().collection('mice').doc(`${profile.userId}`);
    try {
      const doc = await userRef.get();
      if (!doc.exists) {
        await userRef.set(profile)
      }
      return true;
    } catch (error) {
      functions.logger.error('Utils-addBeaconUser', error.message);
      return false;
    }
  }
}

module.exports = new Utils();