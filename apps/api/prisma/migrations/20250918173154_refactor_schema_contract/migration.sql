/*
  Warnings:

  - You are about to drop the column `billingCardBrand` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `billingCardLast4` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Contract` table. All the data in the column will be lost.
  - Added the required column `name` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Made the column `partner` on table `Contract` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `Contract` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `Contract` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."Contract_code_key";

-- AlterTable
ALTER TABLE "public"."Contract" DROP COLUMN "billingCardBrand",
DROP COLUMN "billingCardLast4",
DROP COLUMN "brand",
DROP COLUMN "code",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "partner" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL;
