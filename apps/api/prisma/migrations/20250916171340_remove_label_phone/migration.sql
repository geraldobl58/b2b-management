/*
  Warnings:

  - The values [SALES,ANALYST] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Alert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnrichmentRun` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Integration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobPosting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScrapeTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Signal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."PhoneType" AS ENUM ('MOBILE', 'LANDLINE');

-- CreateEnum
CREATE TYPE "public"."TaxpayerType" AS ENUM ('INSENTO', 'MEI', 'SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL');

-- CreateEnum
CREATE TYPE "public"."CampaignType" AS ENUM ('INCENTIVO', 'TRADE', 'MKT', 'ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_SLIP', 'PIX', 'CASH');

-- CreateEnum
CREATE TYPE "public"."DeliveryType" AS ENUM ('DIGITAL', 'PHYSICAL');

-- CreateEnum
CREATE TYPE "public"."ContactRole" AS ENUM ('CAMPAIGN_MANAGER', 'BILLING_CONTACT', 'VIA_VAREJO_RESP', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."BranchType" AS ENUM ('MATRIZ', 'FILIAL');

-- CreateEnum
CREATE TYPE "public"."CardBrand" AS ENUM ('VISA', 'MASTERCARD', 'AMEX', 'ELO', 'HIPERCARD');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('ADMIN', 'BUSINESS', 'TEAM_MEMBER', 'VIEWER');
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Alert" DROP CONSTRAINT "Alert_signalId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Alert" DROP CONSTRAINT "Alert_targetUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EnrichmentRun" DROP CONSTRAINT "EnrichmentRun_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EnrichmentRun" DROP CONSTRAINT "EnrichmentRun_contactId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JobPosting" DROP CONSTRAINT "JobPosting_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Lead" DROP CONSTRAINT "Lead_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Lead" DROP CONSTRAINT "Lead_contactId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Lead" DROP CONSTRAINT "Lead_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Signal" DROP CONSTRAINT "Signal_companyId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'VIEWER';

-- DropTable
DROP TABLE "public"."Alert";

-- DropTable
DROP TABLE "public"."Company";

-- DropTable
DROP TABLE "public"."Contact";

-- DropTable
DROP TABLE "public"."EnrichmentRun";

-- DropTable
DROP TABLE "public"."Integration";

-- DropTable
DROP TABLE "public"."JobPosting";

-- DropTable
DROP TABLE "public"."Lead";

-- DropTable
DROP TABLE "public"."ScrapeTask";

-- DropTable
DROP TABLE "public"."Signal";

-- DropEnum
DROP TYPE "public"."AlertChannel";

-- DropEnum
DROP TYPE "public"."AlertStatus";

-- DropEnum
DROP TYPE "public"."CompanySize";

-- DropEnum
DROP TYPE "public"."IntegrationType";

-- DropEnum
DROP TYPE "public"."InvestmentStage";

-- DropEnum
DROP TYPE "public"."LeadSource";

-- DropEnum
DROP TYPE "public"."LeadStatus";

-- DropEnum
DROP TYPE "public"."RunStatus";

-- DropEnum
DROP TYPE "public"."ScrapeStatus";

-- DropEnum
DROP TYPE "public"."ScrapeType";

-- DropEnum
DROP TYPE "public"."Seniority";

-- DropEnum
DROP TYPE "public"."SignalType";

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "fantasyName" TEXT NOT NULL,
    "taxpayerType" "public"."TaxpayerType" NOT NULL,
    "stateRegistration" TEXT,
    "typeRelationship" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "zipcode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClientPhone" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" "public"."PhoneType" NOT NULL,
    "number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientPhone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contract" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "brand" TEXT,
    "partner" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "billingCardLast4" TEXT,
    "billingCardBrand" "public"."CardBrand",
    "clientId" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "city" TEXT,
    "type" "public"."CampaignType" NOT NULL,
    "branchType" "public"."BranchType" NOT NULL DEFAULT 'MATRIZ',
    "observations" TEXT,
    "clientId" TEXT NOT NULL,
    "contractId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CampaignContact" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "role" "public"."ContactRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BusinessModel" (
    "id" TEXT NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "upfront" BOOLEAN NOT NULL DEFAULT false,
    "daysToInvoice" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "billingModel" TEXT,
    "estimateMonthly" DECIMAL(14,2),
    "estimateAnnual" DECIMAL(14,2),
    "autoInvoicing" BOOLEAN,
    "priceCycle" TEXT,
    "deliveryType" "public"."DeliveryType" NOT NULL,
    "additional" BOOLEAN,
    "daysToDeliver" INTEGER,
    "chargeFreight" BOOLEAN,
    "b2b" BOOLEAN,
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CampaignConfig" (
    "id" TEXT NOT NULL,
    "contractPending" BOOLEAN NOT NULL DEFAULT false,
    "orderConfirmationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "confirmationTimeMinutes" INTEGER NOT NULL DEFAULT 10,
    "differentialFlow" BOOLEAN NOT NULL DEFAULT false,
    "blockOrdersDuringCampaign" BOOLEAN NOT NULL DEFAULT false,
    "delinquencyPolicy" TEXT,
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_cnpj_key" ON "public"."Client"("cnpj");

-- CreateIndex
CREATE INDEX "Client_cnpj_idx" ON "public"."Client"("cnpj");

-- CreateIndex
CREATE INDEX "Client_createdById_idx" ON "public"."Client"("createdById");

-- CreateIndex
CREATE INDEX "Address_clientId_idx" ON "public"."Address"("clientId");

-- CreateIndex
CREATE INDEX "Address_clientId_isDefault_idx" ON "public"."Address"("clientId", "isDefault");

-- CreateIndex
CREATE INDEX "ClientPhone_clientId_idx" ON "public"."ClientPhone"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_code_key" ON "public"."Contract"("code");

-- CreateIndex
CREATE INDEX "Contract_clientId_idx" ON "public"."Contract"("clientId");

-- CreateIndex
CREATE INDEX "Contract_createdById_idx" ON "public"."Contract"("createdById");

-- CreateIndex
CREATE INDEX "Campaign_clientId_idx" ON "public"."Campaign"("clientId");

-- CreateIndex
CREATE INDEX "Campaign_contractId_idx" ON "public"."Campaign"("contractId");

-- CreateIndex
CREATE INDEX "Campaign_createdById_idx" ON "public"."Campaign"("createdById");

-- CreateIndex
CREATE INDEX "CampaignContact_campaignId_idx" ON "public"."CampaignContact"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignContact_personId_idx" ON "public"."CampaignContact"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignContact_campaignId_personId_role_key" ON "public"."CampaignContact"("campaignId", "personId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessModel_campaignId_key" ON "public"."BusinessModel"("campaignId");

-- CreateIndex
CREATE INDEX "BusinessModel_campaignId_idx" ON "public"."BusinessModel"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignConfig_campaignId_key" ON "public"."CampaignConfig"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignConfig_campaignId_idx" ON "public"."CampaignConfig"("campaignId");

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientPhone" ADD CONSTRAINT "ClientPhone_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampaignContact" ADD CONSTRAINT "CampaignContact_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampaignContact" ADD CONSTRAINT "CampaignContact_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BusinessModel" ADD CONSTRAINT "BusinessModel_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampaignConfig" ADD CONSTRAINT "CampaignConfig_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
