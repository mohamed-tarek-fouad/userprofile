import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import errorHandler from "./helpers/middlewares/errorHandller.js";
import authRouter from "./controllers/users.controller.js";
import registerStrategies from "./helpers/functions/registerStratigies.js";
import { CronJob } from "cron";
import { join } from "path";
const prisma = new PrismaClient();
dotenv.config();

const app = express();
registerStrategies();

// -- Middlewares --
app.use(express.json());
app.use("/uploads", express.static(join(process.cwd(), "uploads")));
// -- Routes --
app.use("/auth", authRouter);

app.use(errorHandler);

const checkForExpiredTokens = new CronJob("@hourly", async () => {
  console.log("Checking for expired tokens...");
  const expiredTokens = await prisma.tokens.findMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
  if (expiredTokens.length > 0) {
    console.log(`Found ${expiredTokens.length} expired tokens`);
    for (const token of expiredTokens) {
      await prisma.tokens.delete({
        where: {
          id: token.id,
        },
      });
    }
    console.log("Deleted expired tokens");
  } else {
    console.log("No expired tokens found");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
  checkForExpiredTokens.start();
});

export { prisma };
