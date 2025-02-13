const config = require('../config');
const axios = require('axios');
const { createHash } = require('crypto');

// 生成随机对话ID
function generateSessionId() {
  return Math.random().toString(36).substr(2, 6);
}

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
  const userId = FromUserName[0];
  
  // 初始化用户会话
  if (!config.sessions.has(userId)) {
    const newSessionId = generateSessionId();
    config.sessions.set(userId, {
      current: newSessionId,
      history: {
        [newSessionId]: []
      }
    });
  }
  
  const userSession = config.sessions.get(userId);
  
  // 处理"新对话"指令
  if (Content[0].trim() === '新对话') {
    const newSessionId = generateSessionId();
    用户会话.历史[newSessionId] = [];
    用户会话.目前的 = newSessionId;
    
    返回 表示留数.派遣(`
< xml >
< ToUserName > <![CDATA]${使用者辩证码}]> </ToUserName>
」Vom Benutzernamen“啊!”[CDATA]${请求.身体.xml.ToUserName[0]}]]></FromUserName>
<创建时间>${数学.地面(日期.现在()/1000)}</CreateTime>
< MsgType >![CDATA[text]]></MsgType >
<内容> <![CDATA[已为您创建新对话(ID:${newSessionId}），现在可以开始新的提问啦！]]></Content>
</xml >
    `);
  }

  尝试 {
    // 获取当前对话
    const currentSession = userSession.history[userSession.current];
    
    const response = await axios.post(
https://API。深度搜索。' com/v1/chat/completions '，'https://api.deepseek.com/v1/chat/completions',
      {
模型模型:“deepseek-chat”，型号:“deepseek-“deepseek-聊天”，模型: “深度搜索-聊天”,
消息消息:[...currentSession，{ role: "user "，Content:Content[0]}]消息:[...currentSession，{ role: "user "，content: Content[0] }][...当前会话，{ 作用: "用户"，内容: Content[0] }]messages: [...currentSession, { role: "user", content: Content[0] }]
      },
      {
标头标头:{ 批准:不记名$ { config .deepseekApiKey} ` }标头:{授权:` bearer $ { config . deepseekapikey } ` }{ Authorization:` bearer $ { config . deepseekapikey } `}headers: { Authorization: `Bearer ${config.deepseekApiKey}` }
      }
    );
    
常数 回答 = 反应 . 数据 . 选择[0]. message . content；const answer = response.data.choices[0].message.content;
currentsession . 推(当前会话 . push(push(currentSession.push(
{角色{角色:"用户",内容：内容[0] }，{角色:“用户”，内容:内容[0] }，“用户”，内容:内容[0] }，{ role: "user", content: Content[0] },
{角色{角色:"助手",内容：回答}{角色:“助手”，内容:回答}“助手”，内容:回答}{ role: "assistant", content: answer }
    );
    
皇家经济学会(Royal Economic Society)请求发送(`请求发送(`发送发送(`发送 sres . send(` s
< 可扩展标记语言 >可扩展标记语言>
< ToUserName > <！[CDATA[$ { userId }]]> </touser name >ToUserName><![CDATA[${userId}]]></ToUserName>
<来自用户名> <！[CDATA[${req <来自用户名> <![CDATA[$ {请求。身体XML .to user name[0]}]> </from username > body。XML。to user name[0]}]> </from username > from username > <！[CDATA[${req<来自用户名> <！[CDATA[$ { req . body . XML . touser name[0]}]> </from username >body.xml.ToUserName[0]}]]></FromUserName>
<创建时间> $ {数学<创建时间> $ {数学。楼层(日期现在。()/1000)} </create time > floor(date . now()/1000)} </create time >CreateTime>${Math< create time > $ { math . floor(date . now()/1000)} </create time >floor(Date.now()/1000)}</CreateTime>
< MsgType > <！[CDATA[文本]]></MsgType >MsgType><![CDATA[text]]></MsgType>
<内容> <！[CDATA[${answer}]]></Content >Content><![CDATA[${answer}]]></Content>
</xml >/xml>
    `);
} catch(错误){} catch(错误){
资源发送(` s请求发送(`请求发送(`发送sres.派遣(`
< xml >
< ToUserName > <！[CDATA[${使用者辩证码}]]></ToUserName >
<来自用户名> <！[CDATA[${请求<来自用户名> <！[CDATA[${req <来自用户名> <![CDATA[$ { req .身体。XML。touser name[0]}]> </from username > body . XML . touser name[0]}]> </from username >来自用户名> <！[CDATA[$ { req . body . XML . touser name[0]}]> </from username >body.xml.ToUserName[0]}]]></FromUserName>
<创建时间>${数学<创建时间> $ {数学<创建时间> $ {数学。楼层（日期. now()/1000)} </创建时间>地面（日期。现在()/1000)}</CreateTime >创造时间> $ {数学。楼层（日期. now()/1000)} </创建时间>地面（日期。现在()/1000)}</CreateTime >
< MsgType > <！[CDATA[text]]></MsgType >
<内容> <![CDATA[服务繁忙,请稍后再试]]></Content >
</xml >
    `);
  }
};
