/*
  Warnings:

  - Made the column `companySize` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `domain` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `industry` on table `Organization` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Organization" ALTER COLUMN "companySize" SET NOT NULL,
ALTER COLUMN "domain" SET NOT NULL,
ALTER COLUMN "industry" SET NOT NULL;
