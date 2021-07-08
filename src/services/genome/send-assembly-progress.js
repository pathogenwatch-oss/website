const notificationDispatcher = require('services/notificationDispatcher');
const { request } = require('services');

module.exports = async function ({ userId, clientId, uploadedAt }) {
  const status = await request('genome', 'fetch-assembly-progress', { userId, uploadedAt });
  notificationDispatcher.publishNotification(
    `${clientId}-assembly`, uploadedAt, {
      type: "STATUS",
      payload: status,
    }
  );
};
