import jwt from 'jsonwebtoken'

import { shared } from '@appblocks/node-sdk'

const handler = async (event) => {
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

  return sendResponse(res, 200, {
    token: token,
    message: 'Token created successfully',
  })
}

export default handler
