import { shared } from '@appblocks/node-sdk';
import { CentrifugoMessageSender } from "./services/centrifugoMessageService/centrifugoMessageService.js";
const handler = async event => {
  const {
    req,
    res
  } = event;
  const {
    healthCheck,
    getBody,
    sendResponse,
    authenticateUser
  } = await shared.getShared();

  // health check
  if (healthCheck(req, res)) return;
  const userInfo = await authenticateUser(req);
  if (userInfo.error) {
    sendResponse(res, 400, {
      success: false,
      msg: userInfo.error
    });
    return;
  }
  class ChatService {
    constructor(messageSender) {
      this.messageSender = messageSender;
    }
    sendMessage(content) {
      this.messageSender.sendMessage(content);
    }
  }
  class MetaCloudWhatsAppSender {
    sendMessage(content) {
      const {
        message,
        phoneNumber
      } = content;
      console.log('meta cloud api');
    }
  }
  const reqBody = await getBody(req);
  let messageSender;
  if (reqBody.sender === 'centrifugo') {
    messageSender = new CentrifugoMessageSender();
  } else if (reqBody.sender === 'metacloud-whatsapp') {
    messageSender = new MetaCloudWhatsAppSender();
  } else {
    throw new Error('Invalid sender type');
  }
  const chatService = new ChatService(messageSender);
  chatService.sendMessage(reqBody);
  return sendResponse(res, 200, {
    message: 'message sent successfully'
  });
};
export default handler;
