const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.unit.createMany({
            data: [
                { name: "Unit 1" },
                { name: "Unit 2" },
                { name: "Unit 3" },
                { name: "Unit 4" },
                { name: "Unit 5" },
            ]
        });

        console.log("Success !");
    } catch (error) {
        console.log("Error seeding the units to database", error);
    } finally {
        await database.$disconnect();
    }
}

main();