-- CreateTable
CREATE TABLE "Standup" (
    "id" TEXT NOT NULL,
    "name" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Standup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speaker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "standupId" TEXT NOT NULL,

    CONSTRAINT "Speaker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Speaker" ADD CONSTRAINT "Speaker_standupId_fkey" FOREIGN KEY ("standupId") REFERENCES "Standup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
