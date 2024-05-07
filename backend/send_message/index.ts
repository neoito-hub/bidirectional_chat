import { shared } from '@appblocks/node-sdk'
import { CentrifugoMessageSender } from './services/centrifugoMessageService/centrifugoMessageService.ts'

import { MessageSender, MessageContent } from './interface.ts'

const handler = async (event) => {
  const { req, res } = event

  const { healthCheck, getBody, sendResponse, authenticateUser } = await shared.getShared()

  // health check
  if (healthCheck(req, res)) return

  const userInfo = await authenticateUser(req)

  if (userInfo.error) {
    sendResponse(res, 400, { success: false, msg: userInfo.error })
    return
  }

  class ChatService {
    constructor(private messageSender: MessageSender) {}

    sendMessage(content: MessageContent): void {
      this.messageSender.sendMessage(content)
    }
  }

  class MetaCloudWhatsAppSender implements MessageSender {
    sendMessage(content: MessageContent): void {
      const { message, phoneNumber } = content
      console.log('meta cloud api')
    }
  }
  const reqBody = await getBody(req)
  let messageSender: MessageSender

  if (reqBody.sender === 'centrifugo') {
    messageSender = new CentrifugoMessageSender()
  } else if (reqBody.sender === 'metacloud-whatsapp') {
    messageSender = new MetaCloudWhatsAppSender()
  } else {
    throw new Error('Invalid sender type')
  }

  const chatService = new ChatService(messageSender)

  chatService.sendMessage(reqBody)

  return sendResponse(res, 200, {
    message: 'message sent successfully',
  })
}

export default handler
