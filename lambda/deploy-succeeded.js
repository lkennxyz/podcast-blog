const https = require('https');

exports.handler = async (event, context, callback) => {
  const { body } = event;
  const json = JSON.parse(body);
  const response = await new Promise((resolve, reject) => {
    const msg = json.payload.title;
    const chatID = msg.includes('Create Blog') ? process.env.TG_GROUP_CHAT_ID : process.env.TG_SOLO_CHAT_ID;
    const uri = process.env.TG_URI.replace('CHID', chatID).replace('MSG', msg);
    const req = https.get(uri, res => {
      res.on('end', () => {
        resolve({ statusCode: 200 });
      });
    });
    req.on('error', () => {
      reject({ statusCode: 500 });
    });
  });
  console.log(response);
  return response;
}