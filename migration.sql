-- CreateEnum
CREATE TYPE "HackathonStatus" AS ENUM ('DRAFT', 'REGISTRATION', 'RUNNING', 'JUDGING', 'FINISHED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PARTICIPANT', 'JUDGE', 'ORGANIZER', 'ADMIN', 'SPONSOR');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('SPONSOR', 'ORGANIZER', 'OTHER');

-- CreateEnum
CREATE TYPE "OrgMemberRole" AS ENUM ('OWNER', 'MANAGER', 'VIEWER');

-- CreateEnum
CREATE TYPE "SponsorshipTier" AS ENUM ('DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'PARTNER');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "techStack" TEXT[],
    "role" "Role" NOT NULL DEFAULT 'PARTICIPANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hackathons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "HackathonStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "registrationOpensAt" TIMESTAMP(3) NOT NULL,
    "registrationClosesAt" TIMESTAMP(3) NOT NULL,
    "judgingStartsAt" TIMESTAMP(3) NOT NULL,
    "judgingEndsAt" TIMESTAMP(3) NOT NULL,
    "maxTeamSize" INTEGER NOT NULL DEFAULT 5,
    "minTeamSize" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hackathons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hackathon_participations" (
    "id" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hackathon_participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "challengeId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "repoUrl" TEXT,
    "demoUrl" TEXT,
    "extraLinks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criteria" (
    "id" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "maxScore" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,
    "criterionId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hackathon_judges" (
    "id" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hackathon_judges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judge_submission_assignments" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "judge_submission_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "type" "OrganizationType" NOT NULL DEFAULT 'SPONSOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_members" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "role" "OrgMemberRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsorships" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "tier" "SponsorshipTier" NOT NULL,
    "benefits" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsorships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "sponsorshipId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "prizeDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsor_shortlists" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsor_shortlists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "profiles_userId_idx" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "profiles_role_idx" ON "profiles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "hackathons_slug_key" ON "hackathons"("slug");

-- CreateIndex
CREATE INDEX "hackathons_slug_idx" ON "hackathons"("slug");

-- CreateIndex
CREATE INDEX "hackathons_status_idx" ON "hackathons"("status");

-- CreateIndex
CREATE INDEX "hackathon_participations_hackathonId_idx" ON "hackathon_participations"("hackathonId");

-- CreateIndex
CREATE INDEX "hackathon_participations_profileId_idx" ON "hackathon_participations"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "hackathon_participations_hackathonId_profileId_key" ON "hackathon_participations"("hackathonId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_code_key" ON "teams"("code");

-- CreateIndex
CREATE INDEX "teams_hackathonId_idx" ON "teams"("hackathonId");

-- CreateIndex
CREATE INDEX "teams_code_idx" ON "teams"("code");

-- CreateIndex
CREATE INDEX "team_members_teamId_idx" ON "team_members"("teamId");

-- CreateIndex
CREATE INDEX "team_members_profileId_idx" ON "team_members"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_teamId_profileId_key" ON "team_members"("teamId", "profileId");

-- CreateIndex
CREATE INDEX "submissions_hackathonId_idx" ON "submissions"("hackathonId");

-- CreateIndex
CREATE INDEX "submissions_teamId_idx" ON "submissions"("teamId");

-- CreateIndex
CREATE INDEX "submissions_challengeId_idx" ON "submissions"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_hackathonId_teamId_key" ON "submissions"("hackathonId", "teamId");

-- CreateIndex
CREATE INDEX "criteria_hackathonId_idx" ON "criteria"("hackathonId");

-- CreateIndex
CREATE INDEX "scores_submissionId_idx" ON "scores"("submissionId");

-- CreateIndex
CREATE INDEX "scores_judgeId_idx" ON "scores"("judgeId");

-- CreateIndex
CREATE INDEX "scores_hackathonId_idx" ON "scores"("hackathonId");

-- CreateIndex
CREATE INDEX "scores_criterionId_idx" ON "scores"("criterionId");

-- CreateIndex
CREATE UNIQUE INDEX "scores_submissionId_judgeId_criterionId_key" ON "scores"("submissionId", "judgeId", "criterionId");

-- CreateIndex
CREATE INDEX "hackathon_judges_hackathonId_idx" ON "hackathon_judges"("hackathonId");

-- CreateIndex
CREATE INDEX "hackathon_judges_profileId_idx" ON "hackathon_judges"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "hackathon_judges_hackathonId_profileId_key" ON "hackathon_judges"("hackathonId", "profileId");

-- CreateIndex
CREATE INDEX "judge_submission_assignments_submissionId_idx" ON "judge_submission_assignments"("submissionId");

-- CreateIndex
CREATE INDEX "judge_submission_assignments_judgeId_idx" ON "judge_submission_assignments"("judgeId");

-- CreateIndex
CREATE UNIQUE INDEX "judge_submission_assignments_submissionId_judgeId_key" ON "judge_submission_assignments"("submissionId", "judgeId");

-- CreateIndex
CREATE INDEX "organizations_type_idx" ON "organizations"("type");

-- CreateIndex
CREATE INDEX "organization_members_organizationId_idx" ON "organization_members"("organizationId");

-- CreateIndex
CREATE INDEX "organization_members_profileId_idx" ON "organization_members"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_organizationId_profileId_key" ON "organization_members"("organizationId", "profileId");

-- CreateIndex
CREATE INDEX "sponsorships_organizationId_idx" ON "sponsorships"("organizationId");

-- CreateIndex
CREATE INDEX "sponsorships_hackathonId_idx" ON "sponsorships"("hackathonId");

-- CreateIndex
CREATE UNIQUE INDEX "sponsorships_organizationId_hackathonId_key" ON "sponsorships"("organizationId", "hackathonId");

-- CreateIndex
CREATE INDEX "challenges_hackathonId_idx" ON "challenges"("hackathonId");

-- CreateIndex
CREATE INDEX "challenges_sponsorshipId_idx" ON "challenges"("sponsorshipId");

-- CreateIndex
CREATE INDEX "sponsor_shortlists_profileId_idx" ON "sponsor_shortlists"("profileId");

-- CreateIndex
CREATE INDEX "sponsor_shortlists_submissionId_idx" ON "sponsor_shortlists"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "sponsor_shortlists_profileId_submissionId_key" ON "sponsor_shortlists"("profileId", "submissionId");

-- AddForeignKey
ALTER TABLE "hackathon_participations" ADD CONSTRAINT "hackathon_participations_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hackathon_participations" ADD CONSTRAINT "hackathon_participations_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criteria" ADD CONSTRAINT "criteria_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES "criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hackathon_judges" ADD CONSTRAINT "hackathon_judges_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hackathon_judges" ADD CONSTRAINT "hackathon_judges_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_submission_assignments" ADD CONSTRAINT "judge_submission_assignments_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_submission_assignments" ADD CONSTRAINT "judge_submission_assignments_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_sponsorshipId_fkey" FOREIGN KEY ("sponsorshipId") REFERENCES "sponsorships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_shortlists" ADD CONSTRAINT "sponsor_shortlists_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_shortlists" ADD CONSTRAINT "sponsor_shortlists_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

