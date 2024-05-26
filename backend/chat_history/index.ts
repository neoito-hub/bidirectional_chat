import { shared } from '@appblocks/node-sdk'
import { RequesBody } from './interface.ts'
import { Request, Response } from 'express'

const handler = async (event: { req: Request; res: Response }): Promise<void> => {
  const { req, res } = event

  const { prisma, healthCheck, getBody, sendResponse, authenticateUser, validateBody } = await shared.getShared()

  if (healthCheck(req, res)) return

  const userInfo = await authenticateUser(req)

  if (userInfo.error) {
    sendResponse(res, 400, { success: false, msg: userInfo.error })
    return
  }

  const reqBody: RequesBody = await getBody(req)

  await validateBody(reqBody, 'chatHistorySchema')

  const chat_id = reqBody.chat_id
  const pageNumber = reqBody?.page_number
  const limit = reqBody?.limit
  const offset = (pageNumber - 1) * limit

  const mesageDetailsCountFetchQuery = `
  SELECT COUNT(*)
  FROM individual_chat_detail as icd
  WHERE icd.chat_id =$1;
`
  const messagesCount = await prisma.$queryRawUnsafe(mesageDetailsCountFetchQuery, chat_id)

  const mesageDetailsFetchQuery = `
  SELECT *
  FROM individual_chat_detail as icd
  WHERE icd.chat_id =$1
  LIMIT $2 OFFSET $3;
`
  const messages = await prisma.$queryRawUnsafe(mesageDetailsFetchQuery, chat_id, limit, offset)

  messages.forEach((chat) => {
    if (chat.sender_id === userInfo?.id) {
      chat.is_owner = true
    } else {
      chat.is_owner = false
    }
  })
  return sendResponse(res, 200, {
    message: 'Chat list retrived successfully',
    data: messages,
    count: messagesCount[0].count,
  })
}

export default handler
