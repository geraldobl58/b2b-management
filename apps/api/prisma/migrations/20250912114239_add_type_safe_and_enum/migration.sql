/*
  Warnings:

  - The `plan` column on the `Organization` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `format` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `SocialPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[workspaceId,campaignId,adGroupId,adId,date,kind]` on the table `MetricDaily` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SocialPost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PlanType" AS ENUM ('BASIC', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."SocialPostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ReportFormat" AS ENUM ('PDF', 'XLSX', 'HTML');

-- AlterTable
ALTER TABLE "public"."Lead" ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "leadValue" DECIMAL(18,2),
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmContent" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmSource" TEXT,
ADD COLUMN     "utmTerm" TEXT;

-- AlterTable
ALTER TABLE "public"."Organization" ADD COLUMN     "companySize" TEXT,
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC',
DROP COLUMN "plan",
ADD COLUMN     "plan" "public"."PlanType" NOT NULL DEFAULT 'BASIC';

-- AlterTable
ALTER TABLE "public"."Report" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "format",
ADD COLUMN     "format" "public"."ReportFormat" NOT NULL DEFAULT 'PDF';

-- AlterTable
ALTER TABLE "public"."SocialPost" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."SocialPostStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_workspaceId_createdAt_idx" ON "public"."AuditLog"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "public"."AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "public"."AuditLog"("userId");

-- CreateIndex
CREATE INDEX "Campaign_status_workspaceId_idx" ON "public"."Campaign"("status", "workspaceId");

-- CreateIndex
CREATE INDEX "Campaign_channel_idx" ON "public"."Campaign"("channel");

-- CreateIndex
CREATE INDEX "Campaign_workspaceId_createdAt_idx" ON "public"."Campaign"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "public"."Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_company_idx" ON "public"."Lead"("company");

-- CreateIndex
CREATE UNIQUE INDEX "MetricDaily_workspaceId_campaignId_adGroupId_adId_date_kind_key" ON "public"."MetricDaily"("workspaceId", "campaignId", "adGroupId", "adId", "date", "kind");

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
