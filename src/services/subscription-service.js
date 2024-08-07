const prisma = require("../models/prisma");

exports.getUserSubcriptionByUserId = (id) =>
  prisma.subscription.findMany({
    where: { userId: id, isExpired: false },
    include: { package: true },
  });

exports.findPackageById = (id) => prisma.package.findUnique({ where: { id } });

exports.createSubcriptionByUser = (userId, packageId, endDate) =>
  prisma.subscription.create({
    data: {
      userId,
      packageId,
      endDate,
    },
  });
