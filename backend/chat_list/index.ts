import { shared } from '@appblocks/node-sdk'
import { RequesBody } from './interface.ts'

const handler = async (event) => {
  const { req, res } = event

  const { prisma, healthCheck, getBody, sendResponse, authenticateUser,validateBody } = await shared.getShared()

  if (healthCheck(req, res)) return

  const userInfo = await authenticateUser(req)

  if (userInfo.error) {
    sendResponse(res, 400, { success: false, msg: userInfo.error })
    return
  }

  const reqBody: RequesBody = await getBody(req)

  await validateBody(reqBody, 'chatListSchema')

  const userId = reqBody?.user_id
  const pageNumber = reqBody?.page_number
  const limit = reqBody?.limit
  const offset = (pageNumber - 1) * limit

  let chatIdFetchQuery = `
  SELECT p.chat_id
  FROM participants as p
  WHERE p.contact_id = $1
`

  const params: any = [userId]

  chatIdFetchQuery += `
  ORDER BY created_at DESC
  LIMIT $2 OFFSET $3;
`

  params.push(limit, offset)
  const chat = await prisma.$queryRawUnsafe(chatIdFetchQuery, ...params)
  const chatIds = chat.map((obj) => obj.chat_id)

  const chatDetailsFetchQuery = `
  SELECT * 
  FROM chat as c 
  WHERE c.id = ANY ($1::text[])
  ORDER BY c.created_at DESC
  LIMIT $2 OFFSET $3;
`
  const chatDetails = await prisma.$queryRawUnsafe(chatDetailsFetchQuery, chatIds, limit, offset)

  return sendResponse(res, 200, {
    chats: chatDetails,
    message: 'Chat list retrived successfully',
  })
}

export default handler
