import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { shared } from '@appblocks/node-sdk'

const handler = async (event: { req: Request; res: Response }): Promise<void> => {
  const { req, res } = event

  const { healthCheck, sendResponse, authenticateUser } = await shared.getShared()

  // health check
  if (healthCheck(req, res)) return

  const userInfo = await authenticateUser(req)

  if (userInfo.error) {
    sendResponse(res, 400, { success: false, msg: userInfo.error })
    return
  }

  const secretKey: string = 'your_secret_key'
  const userID: string = 'user123'
  const expiresIn: number = 7200 // 2 hour

  const token: string = jwt.sign({ sub: userID }, secretKey, { expiresIn })

  const responseData = {
    data: {
      token: token,
      message: 'Token created successfully',
    }
  }

  return sendResponse(res, 200, responseData)
}

export default handler
