const https = require('https');

exports.handler = async (event, context, callback) => {
  const { body } = event;
  const response = await new Promise((resolve, reject) => {
    const chatID = process.env.TG_CHAT_ID
    const msg = JSON.stringify(body.title);
    const uri = process.env.TG_URI.replace('CHID', chatID).replace('MSG', msg);
    console.log(uri);
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