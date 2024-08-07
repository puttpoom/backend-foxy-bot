const prisma = require("../models/prisma");

exports.getAllPackages = () =>
  prisma.package.findMany({
    where: { price: { gt: 0 } },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
    },
  });

exports.getPackageByUserIdAndPackageId = (userId, packageId) => {
  return prisma.package.findFirst({
    where: {
      id: packageId,
      subscriptions: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      subscriptions: true,
    },
  });
};
