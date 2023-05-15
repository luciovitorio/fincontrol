const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function run() {
  const hashedPassword = await bcrypt.hash("12345", 10);

  await prisma.user.create({
    data: {
      username: "lucio",
      email: "lucio@email.com",
      password: hashedPassword,
    },
  });
}

run()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
