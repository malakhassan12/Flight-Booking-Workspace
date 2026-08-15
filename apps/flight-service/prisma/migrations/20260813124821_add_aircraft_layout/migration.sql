-- CreateTable
CREATE TABLE "AircraftLayout" (
    "id" TEXT NOT NULL,
    "aircraftModelId" TEXT NOT NULL,
    "rows" INTEGER NOT NULL,
    "seatsPerRow" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AircraftLayout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AircraftLayout_aircraftModelId_key" ON "AircraftLayout"("aircraftModelId");

-- AddForeignKey
ALTER TABLE "AircraftLayout" ADD CONSTRAINT "AircraftLayout_aircraftModelId_fkey" FOREIGN KEY ("aircraftModelId") REFERENCES "AircraftModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
