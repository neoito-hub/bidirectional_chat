import { shared } from '@appblocks/node-sdk';
import { nanoid } from 'nanoid';
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
  const reqBody = await getBody(req);
  await validateBody(reqBody, 'addContactSchema');
  const userInfo = await authenticateUser(req);
  if (userInfo.error) {
    sendResponse(res, 400, {
      success: false,
      msg: userInfo.error
    });
    return;
  }
  let channelId = nanoid();
  let data = [];
  if (reqBody.registered_user) {
    if (reqBody.id === '' || reqBody.id === null) {
      sendResponse(res, 400, {
        success: false,
        msg: 'shield user id is empty string or null'
      });
      return;
    }
    if (reqBody.phone_number && reqBody.phone_number !== '') {
      const existingContact = await prisma.contact.findUnique({
        where: {
          id: reqBody.id
        }
      });
      if (existingContact) {
        sendResponse(res, 409, {
          success: false,
          msg: 'shield user already exists'
        });
        return;
      }
    }
    const existingEmail = await prisma.contact.findUnique({
      where: {
        email: reqBody.email
      }
    });

    // const existingPhoneNumber = await prisma.contact.findUnique({
    //   where: {
    //     email: reqBody.phone_number,
    //   },
    // })
    // if (existingPhoneNumber) {
    //   sendResponse(res, 409, { success: false, msg: 'shield user already exists' })
    //   return
    // }

    if (existingEmail) {
      sendResponse(res, 409, {
        success: false,
        msg: 'shield user already exists'
      });
      return;
    }
    data = [{
      channel_id: channelId,
      status: 'active',
      ...reqBody
    }];
  } else {
    data = [{
      channel_id: channelId,
      status: 'active',
      name: reqBody.name,
      country_code: reqBody.country_code,
      phone_number: reqBody.phone_number,
      email: reqBody.email,
      address: reqBody.address,
      registered_user: reqBody.registered_user
    }];
  }
  const newContact = await prisma.contact.create({
    data: data[0]
  });
  return sendResponse(res, 200, {
    contact: newContact,
    message: 'Contact created successfully'
  });
};
export default handler;
