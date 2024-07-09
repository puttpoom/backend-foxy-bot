const prisma = require("../models/prisma");

exports.findUserByEmail = (email) =>
  prisma.user.findFirst({ where: { email } });

exports.findUserById = (id) => prisma.user.findFirst({ where: { id } });

exports.createUser = (data) => prisma.user.create({ data });

exports.createLoginHistory = (data) => prisma.loginHistory.create({ data });

exports.updateUser = (id, data) => prisma.user.update({ where: { id }, data });
