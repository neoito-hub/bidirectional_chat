import { shared } from '@appblocks/node-sdk'
import { Request, Response } from 'express'
import { RequesBody, Participants, Chat } from './interface.ts'

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

  await validateBody(reqBody, 'chatListSchema')

  const userId = reqBody?.user_id
  const pageNumber = reqBody?.page_number
  const limit = reqBody?.limit
  const offset = (pageNumber - 1) * limit
  const searchTerm = `%${reqBody?.search}%`

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

  const chatDetailCountFetchQuery = `
  SELECT 
    COUNT(*)
  FROM chat as c 
  WHERE c.id = ANY ($1::text[])
   AND (
      c.latest_message ILIKE $2 OR
      EXISTS (
        SELECT 1
        FROM participants p
        JOIN contact u ON p.contact_id = u.id
        WHERE p.chat_id = c.id
          AND (u.name ILIKE $2 OR u.email ILIKE $2)
      )
    );
`
  const chatDetailsCount = await prisma.$queryRawUnsafe(chatDetailCountFetchQuery, chatIds, searchTerm)

  const chatDetailsFetchQuery = `
  SELECT 
  c.id,c.status,c.latest_message,c.channel_id,c.created_at,c.updated_at,
  (
    SELECT json_agg(json_build_object('contact_id', p.contact_id, 'name', u.name, 'email', u.email))
    FROM participants p
    JOIN contact u ON p.contact_id = u.id
    WHERE p.chat_id = c.id
) AS participants
  FROM chat as c 
  WHERE c.id = ANY ($1::text[])
   AND (
      c.latest_message ILIKE $4 OR
      EXISTS (
        SELECT 1
        FROM participants p
        JOIN contact u ON p.contact_id = u.id
        WHERE p.chat_id = c.id
          AND (u.name ILIKE $4 OR u.email ILIKE $4)
      )
    )
  ORDER BY c.created_at DESC
  LIMIT $2 OFFSET $3;
`
  const chatDetails = await prisma.$queryRawUnsafe(chatDetailsFetchQuery, chatIds, limit, offset, searchTerm)

  const chatDetailsWithChatName = chatDetails.map((chat: Chat) => {
    const otherParticipants = chat.participants.filter((participant: Participants) => participant.contact_id !== userId)
    const chatName = otherParticipants.map((participant: Participants) => participant.name).join(', ')
    const receiverId = otherParticipants.map((participant: Participants) => participant.contact_id).join(', ')

    return {
      ...chat,
      chat_name: chatName,
      receiver_id: receiverId,
    }
  })

  return sendResponse(res, 200, {
    message: 'Chat list retrived successfully',
    data: chatDetailsWithChatName,
    count: chatDetailsCount[0].count,
  })
}

export default handler
