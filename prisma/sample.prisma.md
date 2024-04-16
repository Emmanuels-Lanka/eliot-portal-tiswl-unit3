generator client {
    provider = "prisma-client-js"
}

datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

model User {
    id         String @id @default(uuid())
    name       String
    email      String @unique
    phone      String
    role       String
    password   String
    employeeId String

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model Staff {
    id          String  @id @default(uuid())
    employeeId  String  @unique
    name        String
    email       String  @unique
    phone       String
    designation String
    gender      String
    rfid        String?

    indEngineer ObbSheet[] @relation("IndEngineer")
    supervisor1 ObbSheet[] @relation("Supervisor1")
    supervisor2 ObbSheet[] @relation("Supervisor2")
    mechanic    ObbSheet[] @relation("Mechanic")
    qualityIns  ObbSheet[] @relation("QI")
    accInputMan ObbSheet[] @relation("AccInputMan")
    fabInputMan ObbSheet[] @relation("FabricInputMan")

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model Operator {
    id          String @id @default(uuid())
    name        String
    employeeId  String @unique
    rfid        String @unique
    gender      String
    designation String

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model Unit {
    id   String @id @default(uuid())
    name String

    sewingMachines  SewingMachine[]
    productionLines ProductionLine[]
    obbSheets       ObbSheet[]

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model ProductionLine {
    id   String @id @default(uuid())
    name String @unique

    // sewingMachineId String?
    // sewingMachine   SewingMachine? @relation(fields: [sewingMachineId], references: [id])
    machines SewingMachine[]
    
    unitId String
    unit   Unit   @relation(fields: [unitId], references: [id], onDelete: Cascade)

    obbSheets ObbSheet[]

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@index([unitId])
}

model EliotDevice {
    id            String  @id @default(uuid())
    serialNumber  String  @unique
    modelNumber   String
    installedDate String
    isAssigned    Boolean @default(false)

    sewingMachines SewingMachine[]

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model SewingMachine {
    id           String  @id @default(uuid())
    brandName    String
    machineType  String
    machineId    String  @unique
    serialNumber String  @unique
    ownership    String
    isAssigned   Boolean @default(false)

    eliotDeviceId String
    eliotDevice   EliotDevice @relation(fields: [eliotDeviceId], references: [id], onDelete: Cascade)

    unitId String
    unit   Unit   @relation(fields: [unitId], references: [id], onDelete: Cascade)

    obbOperations   ObbOperation[]
    productionLines ProductionLine[]

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@unique([eliotDeviceId])
    @@index([eliotDeviceId, unitId])
}

model ObbSheet {
    id   String @id @default(uuid())
    name String

    productionLineId String
    productionLine   ProductionLine @relation(fields: [productionLineId], references: [id], onDelete: Cascade)

    unitId String
    unit   Unit   @relation(fields: [unitId], references: [id], onDelete: Cascade)

    indEngineerId String?
    indEngineer   Staff?  @relation(name: "IndEngineer", fields: [indEngineerId], references: [id])
    supervisor1Id String?
    supervisor1   Staff?  @relation(name: "Supervisor1", fields: [supervisor1Id], references: [id])
    supervisor2Id String?
    supervisor2   Staff?  @relation(name: "Supervisor2", fields: [supervisor2Id], references: [id])
    mechanicId    String?
    mechanic      Staff?  @relation(name: "Mechanic", fields: [mechanicId], references: [id])
    qualityInsId  String?
    qualityIns    Staff?  @relation(name: "QI", fields: [qualityInsId], references: [id])
    accInputManId String?
    accInputMan   Staff?  @relation(name: "AccInputMan", fields: [accInputManId], references: [id])
    fabInputManId String?
    fabInputMan   Staff?  @relation(name: "FabricInputMan", fields: [fabInputManId], references: [id])

    obbOperations ObbOperation[]

    buyer            String
    style            String
    item             String
    operators        Int
    helpers          Int
    startingDate     String
    endingDate       String
    workingHours     Int
    efficiencyLevel1 Int
    efficiencyLevel2 Int
    efficiencyLevel3 Int
    itemReference    String?
    totalMP          Int?
    totalSMV         Int?
    bottleNeckTarget Int?
    target100        Int?
    ucl              Int?
    lcl              Int?
    balancingLoss    Int?
    balancingRatio   Int?
    colour           String?
    supResponseTime  Int?
    mecResponseTime  Int?
    qiResponseTime   Int?

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@index([productionLineId, unitId, indEngineerId, supervisor1Id, supervisor2Id, mechanicId, qualityInsId, accInputManId, fabInputManId])
}

model Operation {
    id   String @id @default(uuid())
    name String @unique @db.Text

    obbOperations ObbOperation[]

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model ObbOperation {
    id    String @id @default(uuid())
    seqNo Int    @unique @default(autoincrement())

    operationId String
    operation   Operation @relation(fields: [operationId], references: [id], onDelete: Cascade)

    sewingMachineId String?
    sewingMachine   SewingMachine? @relation(fields: [sewingMachineId], references: [id])

    obbSheetId String
    obbSheet   ObbSheet @relation(fields: [obbSheetId], references: [id], onDelete: Cascade)

    smv           Int
    target        Int
    spi           Int
    length        Int
    totalStitches Int

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@index([operationId, sewingMachineId, obbSheetId])
}
