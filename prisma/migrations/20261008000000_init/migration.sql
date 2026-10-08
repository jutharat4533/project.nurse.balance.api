-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('ACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "ShiftSlot" AS ENUM ('SHIFT', 'DAY', 'NIGHT', 'MORNING', 'EVENING');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'FULL', 'CLOSED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'INTERVIEWED', 'HIRED');

-- CreateEnum
CREATE TYPE "ShiftCategory" AS ENUM ('ONE_SHIFT', 'TWO_SHIFT', 'THREE_SHIFT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "dob" DATE,
    "gender" "Gender",
    "avatar_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_workplace_settings" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "workplace_name" TEXT NOT NULL,
    "base_salary" DECIMAL(65,30),
    "special_allowance" DECIMAL(65,30),

    CONSTRAINT "user_workplace_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_shift_rates" (
    "id" SERIAL NOT NULL,
    "workplace_setting_id" INTEGER NOT NULL,
    "category" "ShiftCategory" NOT NULL,
    "shift_name" TEXT NOT NULL,
    "pay_rate" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "custom_shift_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_deductions" (
    "id" SERIAL NOT NULL,
    "workplace_setting_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "is_percent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "custom_deductions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shifts" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "workplace_setting_id" INTEGER,
    "workplace" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "shift_slot" "ShiftSlot",
    "status" "ShiftStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "special_incomes" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "special_incomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift_compensation" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "shift_id" INTEGER NOT NULL,
    "pay_rate" DECIMAL(65,30) NOT NULL,
    "shift_type" TEXT NOT NULL,

    CONSTRAINT "shift_compensation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_demands" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "about_word" TEXT,
    "compensation" DOUBLE PRECISION NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
    "is_highlighted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "job_demands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_workplace_settings_user_id_workplace_name_key" ON "user_workplace_settings"("user_id", "workplace_name");

-- CreateIndex
CREATE UNIQUE INDEX "shift_compensation_shift_id_key" ON "shift_compensation"("shift_id");

-- AddForeignKey
ALTER TABLE "user_workplace_settings" ADD CONSTRAINT "user_workplace_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_shift_rates" ADD CONSTRAINT "custom_shift_rates_workplace_setting_id_fkey" FOREIGN KEY ("workplace_setting_id") REFERENCES "user_workplace_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_deductions" ADD CONSTRAINT "custom_deductions_workplace_setting_id_fkey" FOREIGN KEY ("workplace_setting_id") REFERENCES "user_workplace_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_workplace_setting_id_fkey" FOREIGN KEY ("workplace_setting_id") REFERENCES "user_workplace_settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "special_incomes" ADD CONSTRAINT "special_incomes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_compensation" ADD CONSTRAINT "shift_compensation_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_demands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
