import { shared } from '@appblocks/node-sdk';
const handler = async event => {
  const {
    req,
    res
  } = event;
  const {
    prisma,
    healthCheck,
    getBody,
    sendResponse,
    authenticateUser,
    validateBody
  } = await shared.getShared();
  if (healthCheck(req, res)) return;
  const userInfo = await authenticateUser(req);
  if (userInfo.error) {
    sendResponse(res, 400, {
      success: false,
      msg: userInfo.error
    });
    return;
  }
  const reqBody = await getBody(req);
  await validateBody(reqBody, 'listContactSchema');
  try {
    const offset = (reqBody.page_number - 1) * reqBody.limit;
    const data = await prisma.contact.findMany({
      where: {
        OR: [{
          name: {
            contains: reqBody.search
          }
        }]
      },
      skip: offset,
      take: reqBody.limit
    });
    return sendResponse(res, 200, {
      contact: data,
      message: 'Contacts retirved successfully'
    });
  } catch (error) {
    throw error;
  }
};
export default handler;
