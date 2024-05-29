import vine from '@vinejs/vine';
const addContactSchema = vine.object({
  name: vine.string(),
  country_code: vine.string().startsWith('+91'),
  phone_number: vine.string(),
  email: vine.string(),
  address: vine.string(),
  registered_user: vine.boolean(),
  id: vine.string().optional()
});
const chatHistorySchema = vine.object({
  chat_id: vine.string(),
  page_number: vine.number(),
  limit: vine.number()
});
const chatListSchema = vine.object({
  user_id: vine.string(),
  page_number: vine.number(),
  limit: vine.number()
});
const listContactSchema = vine.object({
  page_number: vine.number(),
  limit: vine.number(),
  search: vine.string().nullable().optional()
});
export default {
  addContactSchema,
  chatHistorySchema,
  chatListSchema,
  listContactSchema
};
