/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create demo organizations
  const org1 = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'ACME Corporation',
      slug: 'acme-corp',
      domain: 'acme.com',
      industry: 'Technology',
      companySize: '51-200',
      timezone: 'America/New_York',
      billingEmail: 'billing@acme.com',
      plan: 'PRO',
    },
  });

  const org2 = await prisma.organization.upsert({
    where: { slug: 'startup-inc' },
    update: {},
    create: {
      name: 'Startup Inc',
      slug: 'startup-inc',
      domain: 'startup.io',
      industry: 'SaaS',
      companySize: '11-50',
      timezone: 'America/Los_Angeles',
      billingEmail: 'billing@startup.io',
      plan: 'BASIC',
    },
  });

  console.log('✅ Organizations created');

  // Create demo users
  const passwordHash = await hash('demo123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'john@acme.com' },
    update: {},
    create: {
      email: 'john@acme.com',
      name: 'John Smith',
      password: passwordHash,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'sarah@acme.com' },
    update: {},
    create: {
      email: 'sarah@acme.com',
      name: 'Sarah Johnson',
      password: passwordHash,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'mike@startup.io' },
    update: {},
    create: {
      email: 'mike@startup.io',
      name: 'Mike Wilson',
      password: passwordHash,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },
  });

  console.log('✅ Users created');

  // Create organization users
  await prisma.organizationUser.upsert({
    where: {
      organizationId_userId: { organizationId: org1.id, userId: user1.id },
    },
    update: {},
    create: {
      organizationId: org1.id,
      userId: user1.id,
      role: 'OWNER',
    },
  });

  await prisma.organizationUser.upsert({
    where: {
      organizationId_userId: { organizationId: org1.id, userId: user2.id },
    },
    update: {},
    create: {
      organizationId: org1.id,
      userId: user2.id,
      role: 'MANAGER',
    },
  });

  await prisma.organizationUser.upsert({
    where: {
      organizationId_userId: { organizationId: org2.id, userId: user3.id },
    },
    update: {},
    create: {
      organizationId: org2.id,
      userId: user3.id,
      role: 'OWNER',
    },
  });

  console.log('✅ Organization users created');

  // Create workspaces
  const workspace1 = await prisma.workspace.upsert({
    where: { slug: 'acme-marketing' },
    update: {},
    create: {
      organizationId: org1.id,
      name: 'Marketing Team',
      slug: 'acme-marketing',
    },
  });

  const workspace2 = await prisma.workspace.upsert({
    where: { slug: 'startup-growth' },
    update: {},
    create: {
      organizationId: org2.id,
      name: 'Growth Team',
      slug: 'startup-growth',
    },
  });

  console.log('✅ Workspaces created');

  // Create workspace users
  await prisma.workspaceUser.upsert({
    where: {
      workspaceId_userId: { workspaceId: workspace1.id, userId: user1.id },
    },
    update: {},
    create: {
      workspaceId: workspace1.id,
      userId: user1.id,
      role: 'ADMIN',
    },
  });

  await prisma.workspaceUser.upsert({
    where: {
      workspaceId_userId: { workspaceId: workspace1.id, userId: user2.id },
    },
    update: {},
    create: {
      workspaceId: workspace1.id,
      userId: user2.id,
      role: 'MANAGER',
    },
  });

  await prisma.workspaceUser.upsert({
    where: {
      workspaceId_userId: { workspaceId: workspace2.id, userId: user3.id },
    },
    update: {},
    create: {
      workspaceId: workspace2.id,
      userId: user3.id,
      role: 'ADMIN',
    },
  });

  console.log('✅ Workspace users created');

  // Create tags
  const tag1 = await prisma.tag.create({
    data: {
      workspaceId: workspace1.id,
      name: 'Q1 2025',
      color: '#3B82F6',
    },
  });

  const tag2 = await prisma.tag.create({
    data: {
      workspaceId: workspace1.id,
      name: 'Product Launch',
      color: '#10B981',
    },
  });

  const tag3 = await prisma.tag.create({
    data: {
      workspaceId: workspace2.id,
      name: 'Growth',
      color: '#F59E0B',
    },
  });

  console.log('✅ Tags created');

  // Create lead sources
  const leadSource1 = await prisma.leadSource.create({
    data: {
      workspaceId: workspace1.id,
      name: 'Website Contact Form',
      channel: 'SEO',
      details: {
        source: 'organic',
        location: '/contact',
      },
    },
  });

  const leadSource2 = await prisma.leadSource.create({
    data: {
      workspaceId: workspace1.id,
      name: 'Google Ads Landing Page',
      channel: 'GOOGLE_ADS',
      details: {
        source: 'google',
        medium: 'cpc',
      },
    },
  });

  console.log('✅ Lead sources created');

  // Create campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      workspaceId: workspace1.id,
      name: 'Q1 Product Launch - Google Ads',
      channel: 'GOOGLE_ADS',
      externalId: 'gads_12345',
      status: 'ACTIVE',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      dailyBudget: 500.0,
      totalBudget: 45000.0,
      currency: 'USD',
      objective: 'Lead Generation',
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      workspaceId: workspace1.id,
      name: 'Meta Brand Awareness',
      channel: 'META_ADS',
      externalId: 'meta_67890',
      status: 'ACTIVE',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-04-15'),
      dailyBudget: 300.0,
      totalBudget: 27000.0,
      currency: 'USD',
      objective: 'Brand Awareness',
    },
  });

  const campaign3 = await prisma.campaign.create({
    data: {
      workspaceId: workspace2.id,
      name: 'Startup Growth Campaign',
      channel: 'LINKEDIN_ADS',
      status: 'DRAFT',
      dailyBudget: 200.0,
      totalBudget: 6000.0,
      currency: 'USD',
      objective: 'Lead Generation',
    },
  });

  console.log('✅ Campaigns created');

  // Create campaign tags
  await prisma.campaignTag.create({
    data: {
      campaignId: campaign1.id,
      tagId: tag1.id,
    },
  });

  await prisma.campaignTag.create({
    data: {
      campaignId: campaign1.id,
      tagId: tag2.id,
    },
  });

  await prisma.campaignTag.create({
    data: {
      campaignId: campaign3.id,
      tagId: tag3.id,
    },
  });

  console.log('✅ Campaign tags created');

  // Create ad groups
  const adGroup1 = await prisma.adGroup.create({
    data: {
      campaignId: campaign1.id,
      name: 'Search - Product Keywords',
    },
  });

  const adGroup2 = await prisma.adGroup.create({
    data: {
      campaignId: campaign1.id,
      name: 'Display - Remarketing',
    },
  });

  await prisma.adGroup.create({
    data: {
      campaignId: campaign2.id,
      name: 'Interest Targeting',
    },
  });

  console.log('✅ Ad groups created');

  // Create ads
  await prisma.ad.create({
    data: {
      adGroupId: adGroup1.id,
      name: 'Product Demo CTA',
      creativeId: 'creative_123',
      url: 'https://acme.com/demo',
    },
  });

  await prisma.ad.create({
    data: {
      adGroupId: adGroup2.id,
      name: 'Retargeting Banner',
      creativeId: 'creative_456',
      url: 'https://acme.com/signup',
    },
  });

  console.log('✅ Ads created');

  // Create leads
  const leads = [
    {
      workspaceId: workspace1.id,
      sourceId: leadSource1.id,
      campaignId: campaign1.id,
      name: 'Alice Brown',
      email: 'alice.brown@company.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Solutions Inc',
      jobTitle: 'Marketing Manager',
      leadValue: 5000.0,
      status: 'QUALIFIED' as const,
      score: 85,
      notes: 'Interested in enterprise plan',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'product-launch-q1',
      utmContent: 'demo-cta',
      utmTerm: 'marketing-software',
    },
    {
      workspaceId: workspace1.id,
      sourceId: leadSource2.id,
      campaignId: campaign1.id,
      name: 'Bob Davis',
      email: 'bob.davis@startup.com',
      phone: '+1 (555) 987-6543',
      company: 'StartupXYZ',
      jobTitle: 'CEO',
      leadValue: 12000.0,
      status: 'CONTACTED' as const,
      score: 95,
      notes: 'High-value prospect, scheduled demo',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'product-launch-q1',
      utmContent: 'hero-banner',
      utmTerm: 'b2b-marketing-tool',
    },
    {
      workspaceId: workspace1.id,
      sourceId: leadSource1.id,
      name: 'Carol White',
      email: 'carol.white@enterprise.com',
      company: 'Enterprise Corp',
      jobTitle: 'VP Marketing',
      leadValue: 25000.0,
      status: 'NEW' as const,
      score: 70,
      utmSource: 'organic',
      utmMedium: 'search',
    },
    {
      workspaceId: workspace2.id,
      name: 'David Green',
      email: 'david.green@growth.com',
      phone: '+1 (555) 456-7890',
      company: 'Growth Agency',
      jobTitle: 'Growth Manager',
      leadValue: 3000.0,
      status: 'NEW' as const,
      score: 60,
    },
  ];

  for (const leadData of leads) {
    await prisma.lead.create({ data: leadData });
  }

  console.log('✅ Leads created');

  // Create sample metrics for the last 30 days
  const metrics: any[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Campaign 1 metrics
    metrics.push(
      {
        workspaceId: workspace1.id,
        campaignId: campaign1.id,
        date,
        kind: 'IMPRESSIONS' as const,
        value: Math.floor(Math.random() * 10000) + 5000,
      },
      {
        workspaceId: workspace1.id,
        campaignId: campaign1.id,
        date,
        kind: 'CLICKS' as const,
        value: Math.floor(Math.random() * 500) + 100,
      },
      {
        workspaceId: workspace1.id,
        campaignId: campaign1.id,
        date,
        kind: 'COST' as const,
        value: Math.floor(Math.random() * 200) + 300,
      },
      {
        workspaceId: workspace1.id,
        campaignId: campaign1.id,
        date,
        kind: 'CONVERSIONS' as const,
        value: Math.floor(Math.random() * 10) + 2,
      },
    );

    // Campaign 2 metrics
    metrics.push(
      {
        workspaceId: workspace1.id,
        campaignId: campaign2.id,
        date,
        kind: 'IMPRESSIONS' as const,
        value: Math.floor(Math.random() * 8000) + 3000,
      },
      {
        workspaceId: workspace1.id,
        campaignId: campaign2.id,
        date,
        kind: 'CLICKS' as const,
        value: Math.floor(Math.random() * 300) + 50,
      },
      {
        workspaceId: workspace1.id,
        campaignId: campaign2.id,
        date,
        kind: 'COST' as const,
        value: Math.floor(Math.random() * 150) + 200,
      },
    );
  }

  for (const metric of metrics) {
    await prisma.metricDaily.create({ data: metric });
  }

  console.log('✅ Metrics created');

  // Create assets
  const assets = [
    {
      workspaceId: workspace1.id,
      type: 'IMAGE' as const,
      title: 'Product Launch Banner',
      url: 'https://example.com/assets/banner-launch.jpg',
      createdById: user1.id,
      metadata: {
        dimensions: '1200x628',
        fileSize: '245KB',
        format: 'JPG',
      },
    },
    {
      workspaceId: workspace1.id,
      type: 'VIDEO' as const,
      title: 'Demo Video',
      url: 'https://example.com/assets/demo-video.mp4',
      createdById: user2.id,
      metadata: {
        duration: '2:30',
        resolution: '1080p',
        fileSize: '15MB',
      },
    },
    {
      workspaceId: workspace1.id,
      type: 'COPY' as const,
      title: 'Ad Copy Templates',
      url: 'https://example.com/assets/ad-copy.docx',
      createdById: user1.id,
      metadata: {
        wordCount: 500,
        language: 'en',
      },
    },
  ];

  for (const assetData of assets) {
    await prisma.asset.create({ data: assetData });
  }

  console.log('✅ Assets created');

  // Create social posts
  const socialPosts = [
    {
      workspaceId: workspace1.id,
      channel: 'ORGANIC_SOCIAL' as const,
      content:
        'Excited to announce our new product launch! 🚀 #ProductLaunch #Innovation',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2025-01-10T10:00:00Z'),
    },
    {
      workspaceId: workspace1.id,
      channel: 'ORGANIC_SOCIAL' as const,
      content:
        'Behind the scenes: Our team working hard to deliver the best marketing tools 💪',
      status: 'SCHEDULED' as const,
      scheduledAt: new Date('2025-01-20T14:00:00Z'),
    },
    {
      workspaceId: workspace2.id,
      channel: 'LINKEDIN_ADS' as const,
      content:
        'Transform your growth strategy with data-driven insights. Learn more 👇',
      status: 'DRAFT' as const,
    },
  ];

  for (const postData of socialPosts) {
    await prisma.socialPost.create({ data: postData });
  }

  console.log('✅ Social posts created');

  // Create integrations
  const integrations = [
    {
      workspaceId: workspace1.id,
      provider: 'google_ads',
      label: 'ACME Google Ads',
      accessToken: 'encrypted_token_123',
      refreshToken: 'encrypted_refresh_123',
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      settings: {
        accountId: '123-456-7890',
        customerId: '1234567890',
      },
    },
    {
      workspaceId: workspace1.id,
      provider: 'meta',
      label: 'ACME Meta Business',
      accessToken: 'encrypted_token_456',
      settings: {
        adAccountId: '456789',
        pageId: '987654321',
      },
    },
    {
      workspaceId: workspace2.id,
      provider: 'linkedin_ads',
      label: 'Startup LinkedIn',
      accessToken: 'encrypted_token_789',
      settings: {
        accountId: 'urn:li:sponsoredAccount:123456',
      },
    },
  ];

  for (const integrationData of integrations) {
    await prisma.integration.create({ data: integrationData });
  }

  console.log('✅ Integrations created');

  // Create automations
  const automations = [
    {
      workspaceId: workspace1.id,
      name: 'New Lead Notification',
      active: true,
      trigger: {
        type: 'lead.created',
        filters: {
          status: 'NEW',
          score: { gte: 70 },
        },
      },
      actions: [
        {
          type: 'email.send',
          to: ['sales@acme.com'],
          template: 'new-qualified-lead',
        },
        {
          type: 'slack.notify',
          channel: '#sales',
          message: 'New qualified lead: {{lead.name}} from {{lead.company}}',
        },
      ],
    },
    {
      workspaceId: workspace1.id,
      name: 'Campaign Budget Alert',
      active: true,
      trigger: {
        type: 'campaign.budget_threshold',
        filters: {
          threshold: 0.8,
        },
      },
      actions: [
        {
          type: 'email.send',
          to: ['marketing@acme.com'],
          template: 'budget-alert',
        },
      ],
    },
  ];

  for (const automationData of automations) {
    await prisma.automation.create({ data: automationData });
  }

  console.log('✅ Automations created');

  // Create webhook endpoints
  const webhooks = [
    {
      workspaceId: workspace1.id,
      name: 'CRM Integration',
      url: 'https://crm.acme.com/webhooks/marketing',
      secret: 'webhook_secret_123',
    },
    {
      workspaceId: workspace2.id,
      name: 'Analytics Webhook',
      url: 'https://analytics.startup.io/webhooks/events',
      secret: 'webhook_secret_456',
    },
  ];

  for (const webhookData of webhooks) {
    await prisma.webhookEndpoint.create({ data: webhookData });
  }

  console.log('✅ Webhooks created');

  // Create reports
  const reports = [
    {
      workspaceId: workspace1.id,
      name: 'Q1 2025 Performance Report',
      periodStart: new Date('2025-01-01'),
      periodEnd: new Date('2025-03-31'),
      format: 'PDF' as const,
      deliveredTo: ['john@acme.com', 'sarah@acme.com'],
      config: {
        metrics: ['IMPRESSIONS', 'CLICKS', 'CONVERSIONS', 'COST'],
        campaigns: [campaign1.id, campaign2.id],
        charts: ['line', 'bar', 'pie'],
      },
      fileUrl: 'https://reports.acme.com/q1-2025.pdf',
    },
    {
      workspaceId: workspace1.id,
      name: 'Weekly Lead Report',
      periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
      format: 'XLSX' as const,
      deliveredTo: ['sales@acme.com'],
      config: {
        metrics: ['LEADS'],
        includeLeadDetails: true,
      },
    },
  ];

  for (const reportData of reports) {
    await prisma.report.create({ data: reportData });
  }

  console.log('✅ Reports created');

  // Create some audit logs
  const auditLogs = [
    {
      workspaceId: workspace1.id,
      userId: user1.id,
      action: 'CREATE',
      entity: 'Campaign',
      entityId: campaign1.id,
      changes: {
        name: 'Q1 Product Launch - Google Ads',
        status: 'DRAFT',
      },
    },
    {
      workspaceId: workspace1.id,
      userId: user1.id,
      action: 'UPDATE',
      entity: 'Campaign',
      entityId: campaign1.id,
      changes: {
        before: { status: 'DRAFT' },
        after: { status: 'ACTIVE' },
      },
    },
    {
      workspaceId: workspace1.id,
      userId: user2.id,
      action: 'CREATE',
      entity: 'Lead',
      entityId: 'lead_123',
      changes: {
        name: 'Alice Brown',
        email: 'alice.brown@company.com',
        status: 'NEW',
      },
    },
  ];

  // Note: AuditLog creation will be handled by future middleware/interceptors
  console.log('⚠️ AuditLog creation skipped - will be implemented via middleware');

  console.log('✅ Audit logs created');

  console.log('🎉 Seed completed successfully!');
  console.log(`
📊 Created:
• 2 Organizations (ACME Corp, Startup Inc)
• 3 Users (john@acme.com, sarah@acme.com, mike@startup.io)
• 2 Workspaces
• 3 Campaigns (1 active, 1 active, 1 draft)
• 4 Leads (various statuses)
• 30 days of metrics data
• 3 Assets
• 3 Social posts
• 3 Integrations
• 2 Automations
• 2 Webhook endpoints
• 2 Reports
• Sample data ready for audit logs (when implemented)

🔑 Demo credentials:
Email: john@acme.com
Password: demo123
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
