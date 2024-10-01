-- CreateTable
CREATE TABLE "Booking_record" (
    "record_id" INTEGER NOT NULL,
    "at" DATETIME NOT NULL,
    "from_time" INTEGER NOT NULL,
    "to_time" INTEGER NOT NULL,
    "room" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Requests" (
    "request_id" INTEGER NOT NULL,
    "record_id_1" INTEGER NOT NULL,
    "record_id_2" INTEGER,
    "author" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "reject_reason" TEXT,
    "reviewed_by" TEXT
);

-- CreateTable
CREATE TABLE "Users" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_record_record_id_key" ON "Booking_record"("record_id");

-- CreateIndex
CREATE UNIQUE INDEX "Requests_request_id_key" ON "Requests"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
