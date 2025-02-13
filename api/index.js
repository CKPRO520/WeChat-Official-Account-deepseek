const config = require('../config');
   const axios = require('axios');
   const { createHash } = require('crypto');
   
   module.exports = async (req, res) => {
     const { signature, timestamp, nonce, echostr } = req.query;
     
     // 验证微信服务器
     if (req.method === 'GET') {
       const token = config.token;
       const arr = [token, timestamp, nonce].sort();
       const sha1 = createHash('sha1').update(arr.join('')).digest('hex');
       
       if (sha1 === signature) {
         res.send(echostr);
       } else {
         res.status(403).send('Invalid signature');
       }
       return;
     }

     // 处理用户消息
     const { FromUserName, Content } = req.body.xml;
     let session = config.sessions.get(FromUserName) || [];
     
     try {
       const response = await axios.post(
         'https://api.deepseek.com/v1/chat/completions',
         {
           model: "deepseek-chat",
           messages: [...session, { role: "user", content: Content }]
         },
         {
           headers: { Authorization: `Bearer ${config.deepseekApiKey}` }
         }
       );
       
       const answer = response.data.choices[0].message.content;
       session.push({ role: "user", content: Content }, { role: "assistant", content: answer });
       config.sessions.set(FromUserName, session);
       
       res.send(`
         <xml>
           <ToUserName><![CDATA[${FromUserName}]]></ToUserName>
           <FromUserName><![CDATA[${req.body.xml.ToUserName}]]></FromUserName>
           <CreateTime>${Math.floor(Date.now()/1000)}</CreateTime>
           <MsgType><![CDATA[text]]></MsgType>
           <Content><![CDATA[${answer}]]></Content>
         </xml>
       `);
     } catch (error) {
       res.send(`
         <xml>...</xml>
       `).replace('${answer}', '服务暂时不可用，请稍后再试');
     }
   };
