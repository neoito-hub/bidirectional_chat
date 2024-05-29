import { shared } from '@appblocks/node-sdk'
import { nanoid } from 'nanoid'
import { RequesBody } from './interface.ts'
import { Request, Response } from 'express'

const handler = async (event: { req: Request; res: Response }): Promise<void> => {
  const { req, res } = event

  const { prisma, healthCheck, getBody, sendResponse, authenticateUser, validateBody } = await shared.getShared()

  if (healthCheck(req, res)) return

  const reqBody: RequesBody = await getBody(req)

  await validateBody(reqBody, 'addContactSchema')

  const userInfo = await authenticateUser(req)

  if (userInfo.error) {
    sendResponse(res, 400, { success: false, msg: userInfo.error })
    return
  }

  let channelId = nanoid()
  let data = []

  if (reqBody.registered_user) {
    if (reqBody.id === '' || reqBody.id === null) {
      sendResponse(res, 400, { success: false, msg: 'shield user id is empty string or null' })
      return
    }

    const existingContact = await prisma.contact.findFirst({
      where: {
        OR: [{ id: reqBody.id }, { email: reqBody.email }],
      },
    })

    if (existingContact) {
      sendResponse(res, 200, { success: true, msg: 'shield user already exists', data: existingContact })
      return
    }

    data = [{ channel_id: channelId, status: 'active', ...reqBody }]
  } else {
    data = [
      {
        channel_id: channelId,
        status: 'active',
        name: reqBody.name,
        country_code: reqBody.country_code,
        phone_number: reqBody.phone_number,
        email: reqBody.email,
        address: reqBody.address,
        registered_user: reqBody.registered_user,
      },
    ]
  }

  const newContact = await prisma.contact.create({
    data: data[0],
  })

  return sendResponse(res, 200, {
    contact: newContact,
    message: 'Contact created successfully',
  })
}

export default handler
