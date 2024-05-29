import jwt from 'jsonwebtoken';
import { shared } from '@appblocks/node-sdk';
const handler = async event => {
  const {
    req,
    res
  } = event;
  const {
    healthCheck,
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
  const secretKey = process.env.BB_BIDIRECTIONAL_CHAT_CENTRIFUGO_SECRET_KEY;
  const userID = 'user123';
  const expiresIn = 7200; // 2 hour

  const token = jwt.sign({
    sub: userID
  }, secretKey, {
    expiresIn
  });
  const responseData = {
    data: {
      token: token,
      message: 'Token created successfully'
    }
  };
  return sendResponse(res, 200, responseData);
};
export default handler;
