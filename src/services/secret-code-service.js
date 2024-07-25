const prisma = require("../models/prisma");

exports.findSecretCode = (secretCode) =>
  prisma.secretCode.findFirst({
    where: { code: secretCode, isActivated: false },
  });

exports.createSecretCode = (data) => prisma.secretCode.create({ data });

exports.activateSecretCode = (id, userId) =>
  prisma.secretCode.update({
    where: { id },
    data: { isActivated: true, userId },
  });

exports.deactivateSecretCode = (id) =>
  prisma.secretCode.delete({ where: { id } });
