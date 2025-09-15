-- CreateEnum
CREATE TYPE "public"."CompanySize" AS ENUM ('MICRO', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."InvestmentStage" AS ENUM ('NONE', 'SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C_PLUS');

-- CreateEnum
CREATE TYPE "public"."Seniority" AS ENUM ('INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'DIRECTOR', 'VP', 'C_LEVEL');

-- CreateEnum
CREATE TYPE "public"."LeadStatus" AS ENUM ('NEW', 'ENRICHING', 'QUALIFIED', 'CONTACTED', 'NEGOTIATION', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "public"."LeadSource" AS ENUM ('MANUAL', 'IMPORT', 'SCRAPER', 'JOB_BOARD', 'NEWS', 'FUNDING', 'REFERRAL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."SignalType" AS ENUM ('JOB_POST', 'NEWS', 'FUNDING', 'TECH_STACK', 'HIRING_PAGE_UPDATE', 'WEBSITE_UPDATE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."AlertStatus" AS ENUM ('PENDING', 'SENT', 'READ', 'DISMISSED');

-- CreateEnum
CREATE TYPE "public"."AlertChannel" AS ENUM ('IN_APP', 'EMAIL', 'SLACK', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "public"."RunStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "public"."IntegrationType" AS ENUM ('HUBSPOT', 'PIPEDRIVE', 'RDSTATION', 'SLACK', 'GOOGLE_SHEETS', 'WEBHOOK', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."ScrapeStatus" AS ENUM ('SCHEDULED', 'RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ScrapeType" AS ENUM ('COMPANY_PROFILE', 'JOB_BOARD', 'NEWS_FEED', 'FUNDING_FEED', 'HIRING_PAGE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'SALES', 'ANALYST');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT,
    "name" TEXT NOT NULL,
    "tradeName" TEXT,
    "domain" TEXT,
    "website" TEXT,
    "linkedin" TEXT,
    "industry" TEXT,
    "size" "public"."CompanySize",
    "employeesMin" INTEGER,
    "employeesMax" INTEGER,
    "country" TEXT DEFAULT 'BR',
    "state" TEXT,
    "city" TEXT,
    "investmentStage" "public"."InvestmentStage" DEFAULT 'NONE',
    "isHiring" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "lastSeenAt" TIMESTAMP(3),
    "lastJobPostAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "seniority" "public"."Seniority",
    "email" TEXT,
    "phone" TEXT,
    "linkedin" TEXT,
    "isDecisionMaker" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "contactId" TEXT,
    "ownerId" TEXT,
    "status" "public"."LeadStatus" NOT NULL DEFAULT 'NEW',
    "source" "public"."LeadSource" NOT NULL DEFAULT 'OTHER',
    "score" INTEGER NOT NULL DEFAULT 0,
    "value" DECIMAL(12,2),
    "currency" TEXT DEFAULT 'BRL',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Signal" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" "public"."SignalType" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "payload" JSONB,
    "confidence" INTEGER NOT NULL DEFAULT 80,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Alert" (
    "id" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "channel" "public"."AlertChannel" NOT NULL DEFAULT 'IN_APP',
    "status" "public"."AlertStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobPosting" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT,
    "seniority" "public"."Seniority",
    "location" TEXT,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "sourceUrl" TEXT,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EnrichmentRun" (
    "id" TEXT NOT NULL,
    "status" "public"."RunStatus" NOT NULL DEFAULT 'QUEUED',
    "provider" TEXT NOT NULL,
    "cost" DECIMAL(10,4),
    "companyId" TEXT,
    "contactId" TEXT,
    "input" JSONB,
    "output" JSONB,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnrichmentRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Integration" (
    "id" TEXT NOT NULL,
    "type" "public"."IntegrationType" NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScrapeTask" (
    "id" TEXT NOT NULL,
    "type" "public"."ScrapeType" NOT NULL,
    "targetUrl" TEXT,
    "query" TEXT,
    "status" "public"."ScrapeStatus" NOT NULL DEFAULT 'SCHEDULED',
    "lastRunAt" TIMESTAMP(3),
    "schedule" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrapeTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_cnpj_key" ON "public"."Company"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Company_domain_key" ON "public"."Company"("domain");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "public"."Company"("name");

-- CreateIndex
CREATE INDEX "Company_industry_idx" ON "public"."Company"("industry");

-- CreateIndex
CREATE INDEX "Company_isHiring_lastJobPostAt_idx" ON "public"."Company"("isHiring", "lastJobPostAt");

-- CreateIndex
CREATE INDEX "Company_score_idx" ON "public"."Company"("score");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "public"."Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_companyId_idx" ON "public"."Contact"("companyId");

-- CreateIndex
CREATE INDEX "Contact_name_idx" ON "public"."Contact"("name");

-- CreateIndex
CREATE INDEX "Contact_isDecisionMaker_idx" ON "public"."Contact"("isDecisionMaker");

-- CreateIndex
CREATE INDEX "Lead_companyId_status_idx" ON "public"."Lead"("companyId", "status");

-- CreateIndex
CREATE INDEX "Lead_ownerId_status_idx" ON "public"."Lead"("ownerId", "status");

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "public"."Lead"("source");

-- CreateIndex
CREATE INDEX "Lead_score_idx" ON "public"."Lead"("score");

-- CreateIndex
CREATE INDEX "Signal_companyId_type_occurredAt_idx" ON "public"."Signal"("companyId", "type", "occurredAt");

-- CreateIndex
CREATE INDEX "Alert_targetUserId_status_idx" ON "public"."Alert"("targetUserId", "status");

-- CreateIndex
CREATE INDEX "Alert_signalId_idx" ON "public"."Alert"("signalId");

-- CreateIndex
CREATE INDEX "JobPosting_companyId_capturedAt_idx" ON "public"."JobPosting"("companyId", "capturedAt");

-- CreateIndex
CREATE INDEX "EnrichmentRun_companyId_idx" ON "public"."EnrichmentRun"("companyId");

-- CreateIndex
CREATE INDEX "EnrichmentRun_contactId_idx" ON "public"."EnrichmentRun"("contactId");

-- CreateIndex
CREATE INDEX "EnrichmentRun_status_idx" ON "public"."EnrichmentRun"("status");

-- CreateIndex
CREATE INDEX "EnrichmentRun_provider_idx" ON "public"."EnrichmentRun"("provider");

-- CreateIndex
CREATE INDEX "Integration_type_active_idx" ON "public"."Integration"("type", "active");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_type_name_key" ON "public"."Integration"("type", "name");

-- CreateIndex
CREATE INDEX "ScrapeTask_type_status_idx" ON "public"."ScrapeTask"("type", "status");

-- CreateIndex
CREATE INDEX "ScrapeTask_lastRunAt_idx" ON "public"."ScrapeTask"("lastRunAt");

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Signal" ADD CONSTRAINT "Signal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Alert" ADD CONSTRAINT "Alert_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "public"."Signal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Alert" ADD CONSTRAINT "Alert_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobPosting" ADD CONSTRAINT "JobPosting_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EnrichmentRun" ADD CONSTRAINT "EnrichmentRun_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EnrichmentRun" ADD CONSTRAINT "EnrichmentRun_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
