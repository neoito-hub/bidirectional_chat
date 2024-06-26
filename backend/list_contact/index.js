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
    const limit = reqBody.limit;
    const searchValue = `%${reqBody.search}%`;
    const contactsCount = await prisma.$queryRaw`SELECT COUNT(*) as total FROM (
      SELECT 
       c.name  
      FROM contact as c
      WHERE c.name ILIKE ${searchValue}
      AND c.id != ${userInfo?.id}
  ) as subquery;
  `;
    const contactsInfo = await prisma.$queryRaw`
      SELECT 
      *
      FROM contact as c
      WHERE c.name ILIKE ${searchValue}
      AND c.id != ${userInfo?.id}
      LIMIT ${limit} 
      OFFSET ${offset};`;
    let result = {
      contacts: contactsInfo,
      count: contactsCount[0].total
    };
    return sendResponse(res, 200, {
      message: 'Contacts retirved successfully',
      data: result
    });
  } catch (error) {
    throw error;
  }
};
export default handler;
