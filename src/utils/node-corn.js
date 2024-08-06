const cron = require("node-cron");
const prisma = require("../models/prisma");

cron.schedule("* * * * *", async () => {
  console.log("Running cron job to check for expired subscriptions");
  const expiredSubscriptions = await prisma.subscription.findMany({
    where: {
      endDate: {
        lt: new Date(),
      },
    },
  });

  expiredSubscriptions.forEach(async (subscription) => {
    await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        isExpired: true,
      },
    });
    console.log(
      `Subscription ${subscription.id} for userId ${subscription.userId} has expired`
    );
  });
});
