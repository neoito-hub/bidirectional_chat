async function addContact(prisma) {
  const bulkData = [{
    id: '1',
    name: 'Fred',
    country_code: '91',
    phone_number: '897657688',
    channel_id: "TEST_ID"
  }, {
    id: '2',
    name: 'joseph',
    country_code: '91',
    phone_number: '897657688dd',
    channel_id: "TEST_ID"
  }];
  await prisma.contact.createMany({
    data: bulkData
  });
  console.log('Data seeded successfully');
}
export default addContact;
