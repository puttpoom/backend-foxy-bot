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
