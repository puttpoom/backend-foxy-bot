const prisma = require("../models/prisma");

exports.findUserByEmail = (email) =>
  prisma.user.findFirst({ where: { email } });

exports.findUserById = (id) => prisma.user.findUnique({ where: { id } });

exports.createUser = (data) => prisma.user.create({ data });

exports.updateUserUUID = (id, uuid) =>
  prisma.user.update({ where: { id }, data: { uuid } });

exports.getUserPointByUserId = (id) =>
  prisma.user.findFirst({ where: { id }, select: { point: true } });

exports.updateUserPointByUserId = (id, point) =>
  prisma.user.update({ where: { id }, data: { point } });

exports.findUserByLineId = (lineId) =>
  prisma.user.findFirst({ where: { lineId } });

exports.createUserWithLineId = (data) => prisma.user.create({ data });
