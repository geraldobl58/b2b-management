import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Limpar dados existentes
  console.log('🧹 Cleaning existing data...');
  await prisma.alert.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.enrichmentRun.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.scrapeTask.deleteMany();

  // Seed Users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('MyPass123!', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@empresa.com',
      name: 'Admin Silva',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: 'vendas@empresa.com',
      name: 'João Vendedor',
      password: hashedPassword,
      role: 'SALES',
    },
  });

  const analystUser = await prisma.user.create({
    data: {
      email: 'analista@empresa.com',
      name: 'Maria Analista',
      password: hashedPassword,
      role: 'ANALYST',
    },
  });

  // Seed Companies
  console.log('🏢 Creating companies...');
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        cnpj: '11.222.333/0001-44',
        name: 'TechCorp Ltda',
        tradeName: 'TechCorp',
        domain: 'techcorp.com.br',
        website: 'https://techcorp.com.br',
        linkedin: 'https://linkedin.com/company/techcorp',
        industry: 'Tecnologia',
        size: 'MEDIUM',
        employeesMin: 50,
        employeesMax: 200,
        country: 'BR',
        state: 'SP',
        city: 'São Paulo',
        investmentStage: 'SERIES_A',
        isHiring: true,
        score: 85,
        lastSeenAt: new Date(),
        lastJobPostAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      },
    }),
    prisma.company.create({
      data: {
        cnpj: '22.333.444/0001-55',
        name: 'InovaSoft S.A.',
        tradeName: 'InovaSoft',
        domain: 'inovasoft.com.br',
        website: 'https://inovasoft.com.br',
        linkedin: 'https://linkedin.com/company/inovasoft',
        industry: 'Software',
        size: 'LARGE',
        employeesMin: 200,
        employeesMax: 1000,
        country: 'BR',
        state: 'RJ',
        city: 'Rio de Janeiro',
        investmentStage: 'SERIES_B',
        isHiring: true,
        score: 92,
        lastSeenAt: new Date(),
        lastJobPostAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      },
    }),
    prisma.company.create({
      data: {
        cnpj: '33.444.555/0001-66',
        name: 'StartupXYZ ME',
        tradeName: 'StartupXYZ',
        domain: 'startupxyz.com.br',
        website: 'https://startupxyz.com.br',
        industry: 'Fintech',
        size: 'SMALL',
        employeesMin: 10,
        employeesMax: 50,
        country: 'BR',
        state: 'MG',
        city: 'Belo Horizonte',
        investmentStage: 'SEED',
        isHiring: false,
        score: 68,
        lastSeenAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
      },
    }),
    prisma.company.create({
      data: {
        name: 'Global Tech Inc',
        domain: 'globaltech.com',
        website: 'https://globaltech.com',
        linkedin: 'https://linkedin.com/company/globaltech',
        industry: 'E-commerce',
        size: 'ENTERPRISE',
        employeesMin: 1000,
        employeesMax: 5000,
        country: 'US',
        state: 'CA',
        city: 'San Francisco',
        investmentStage: 'SERIES_C_PLUS',
        isHiring: true,
        score: 95,
        lastSeenAt: new Date(),
        lastJobPostAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
      },
    }),
    prisma.company.create({
      data: {
        cnpj: '44.555.666/0001-77',
        name: 'Micro Empresa Digital',
        tradeName: 'MED',
        domain: 'med.com.br',
        industry: 'Marketing Digital',
        size: 'MICRO',
        employeesMin: 1,
        employeesMax: 10,
        country: 'BR',
        state: 'SC',
        city: 'Florianópolis',
        investmentStage: 'NONE',
        isHiring: false,
        score: 45,
        lastSeenAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      },
    }),
  ]);

  // Seed Contacts
  console.log('👤 Creating contacts...');
  const contacts = await Promise.all([
    // TechCorp
    prisma.contact.create({
      data: {
        companyId: companies[0].id,
        name: 'Carlos Silva',
        title: 'CTO',
        seniority: 'C_LEVEL',
        email: 'carlos.silva@techcorp.com.br',
        phone: '+55 11 99999-1111',
        linkedin: 'https://linkedin.com/in/carlos-silva-cto',
        isDecisionMaker: true,
      },
    }),
    prisma.contact.create({
      data: {
        companyId: companies[0].id,
        name: 'Ana Santos',
        title: 'Gerente de RH',
        seniority: 'SENIOR',
        email: 'ana.santos@techcorp.com.br',
        phone: '+55 11 99999-2222',
        linkedin: 'https://linkedin.com/in/ana-santos-rh',
        isDecisionMaker: false,
      },
    }),
    // InovaSoft
    prisma.contact.create({
      data: {
        companyId: companies[1].id,
        name: 'Roberto Lima',
        title: 'CEO',
        seniority: 'C_LEVEL',
        email: 'roberto.lima@inovasoft.com.br',
        phone: '+55 21 99999-3333',
        linkedin: 'https://linkedin.com/in/roberto-lima-ceo',
        isDecisionMaker: true,
      },
    }),
    prisma.contact.create({
      data: {
        companyId: companies[1].id,
        name: 'Fernanda Costa',
        title: 'Diretora de Tecnologia',
        seniority: 'DIRECTOR',
        email: 'fernanda.costa@inovasoft.com.br',
        linkedin: 'https://linkedin.com/in/fernanda-costa-tech',
        isDecisionMaker: true,
      },
    }),
    // StartupXYZ
    prisma.contact.create({
      data: {
        companyId: companies[2].id,
        name: 'Pedro Oliveira',
        title: 'Founder & CEO',
        seniority: 'C_LEVEL',
        email: 'pedro@startupxyz.com.br',
        phone: '+55 31 99999-4444',
        isDecisionMaker: true,
      },
    }),
    // Global Tech
    prisma.contact.create({
      data: {
        companyId: companies[3].id,
        name: 'Sarah Johnson',
        title: 'VP of Engineering',
        seniority: 'VP',
        email: 'sarah.johnson@globaltech.com',
        phone: '+1 415 555-0123',
        linkedin: 'https://linkedin.com/in/sarah-johnson-vp',
        isDecisionMaker: true,
      },
    }),
    prisma.contact.create({
      data: {
        companyId: companies[3].id,
        name: 'Mike Chen',
        title: 'Senior Developer',
        seniority: 'SENIOR',
        email: 'mike.chen@globaltech.com',
        linkedin: 'https://linkedin.com/in/mike-chen-dev',
        isDecisionMaker: false,
      },
    }),
    // Micro Empresa
    prisma.contact.create({
      data: {
        companyId: companies[4].id,
        name: 'Lucas Mendes',
        title: 'Sócio Fundador',
        seniority: 'C_LEVEL',
        email: 'lucas@med.com.br',
        phone: '+55 48 99999-5555',
        isDecisionMaker: true,
      },
    }),
  ]);

  // Seed Leads
  console.log('🎯 Creating leads...');
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        companyId: companies[0].id,
        contactId: contacts[0].id,
        ownerId: salesUser.id,
        status: 'QUALIFIED',
        source: 'MANUAL',
        score: 85,
        value: '50000.00',
        currency: 'BRL',
        notes:
          'Empresa interessada em solução de IA para otimização de processos',
      },
    }),
    prisma.lead.create({
      data: {
        companyId: companies[1].id,
        contactId: contacts[2].id,
        ownerId: salesUser.id,
        status: 'NEGOTIATION',
        source: 'REFERRAL',
        score: 92,
        value: '120000.00',
        currency: 'BRL',
        notes: 'Proposta enviada, aguardando retorno da diretoria',
      },
    }),
    prisma.lead.create({
      data: {
        companyId: companies[2].id,
        contactId: contacts[4].id,
        ownerId: adminUser.id,
        status: 'CONTACTED',
        source: 'SCRAPER',
        score: 68,
        value: '25000.00',
        currency: 'BRL',
        notes: 'Startup em crescimento, potencial para parceria',
      },
    }),
    prisma.lead.create({
      data: {
        companyId: companies[3].id,
        contactId: contacts[5].id,
        ownerId: salesUser.id,
        status: 'WON',
        source: 'FUNDING',
        score: 95,
        value: '500000.00',
        currency: 'USD',
        notes: 'Contrato assinado para implementação global',
        closedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.lead.create({
      data: {
        companyId: companies[4].id,
        contactId: contacts[7].id,
        ownerId: analystUser.id,
        status: 'LOST',
        source: 'IMPORT',
        score: 45,
        notes: 'Orçamento insuficiente para o projeto',
        closedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  // Seed Job Postings
  console.log('💼 Creating job postings...');
  await Promise.all([
    prisma.jobPosting.create({
      data: {
        companyId: companies[0].id,
        title: 'Desenvolvedor Full Stack Senior',
        department: 'Tecnologia',
        seniority: 'SENIOR',
        location: 'São Paulo, SP',
        remote: true,
        source: 'LinkedIn',
        sourceUrl: 'https://linkedin.com/jobs/123456',
        capturedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.jobPosting.create({
      data: {
        companyId: companies[1].id,
        title: 'Engenheiro de Dados',
        department: 'Data',
        seniority: 'MID',
        location: 'Rio de Janeiro, RJ',
        remote: false,
        source: 'Gupy',
        sourceUrl: 'https://inovasoft.gupy.io/jobs/654321',
        capturedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.jobPosting.create({
      data: {
        companyId: companies[3].id,
        title: 'Frontend Engineer',
        department: 'Engineering',
        seniority: 'SENIOR',
        location: 'San Francisco, CA',
        remote: true,
        source: 'Greenhouse',
        sourceUrl: 'https://boards.greenhouse.io/globaltech/jobs/789012',
        capturedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    }),
    prisma.jobPosting.create({
      data: {
        companyId: companies[3].id,
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        seniority: 'LEAD',
        location: 'San Francisco, CA',
        remote: true,
        source: 'AngelList',
        capturedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    }),
  ]);

  // Seed Signals
  console.log('🔍 Creating signals...');
  const signals = await Promise.all([
    prisma.signal.create({
      data: {
        companyId: companies[0].id,
        type: 'JOB_POST',
        title: 'Nova vaga para Desenvolvedor Full Stack Senior',
        url: 'https://linkedin.com/jobs/123456',
        payload: {
          jobTitle: 'Desenvolvedor Full Stack Senior',
          department: 'Tecnologia',
          location: 'São Paulo, SP',
          remote: true,
        },
        confidence: 95,
        occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.signal.create({
      data: {
        companyId: companies[1].id,
        type: 'FUNDING',
        title: 'InovaSoft recebe aporte de R$ 50 milhões',
        url: 'https://exame.com/negocios/inovasoft-aporte-50-milhoes',
        payload: {
          amount: '50000000',
          currency: 'BRL',
          investor: 'Venture Capital XYZ',
          round: 'Series B',
        },
        confidence: 90,
        occurredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.signal.create({
      data: {
        companyId: companies[3].id,
        type: 'NEWS',
        title: 'Global Tech anuncia expansão para América Latina',
        url: 'https://techcrunch.com/global-tech-latam-expansion',
        payload: {
          headline: 'Global Tech anuncia expansão para América Latina',
          summary: 'Empresa planeja abrir escritórios no Brasil e México',
          category: 'expansion',
        },
        confidence: 85,
        occurredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.signal.create({
      data: {
        companyId: companies[0].id,
        type: 'WEBSITE_UPDATE',
        title: 'Atualização na página de carreiras da TechCorp',
        payload: {
          changes: [
            'Nova seção de benefícios',
            'Página de diversidade e inclusão',
          ],
          detectedAt: new Date(),
        },
        confidence: 75,
        occurredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.signal.create({
      data: {
        companyId: companies[2].id,
        type: 'TECH_STACK',
        title: 'StartupXYZ adota nova stack de desenvolvimento',
        payload: {
          technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
          source: 'job_posting_analysis',
        },
        confidence: 70,
        occurredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  // Seed Alerts
  console.log('🚨 Creating alerts...');
  await Promise.all([
    prisma.alert.create({
      data: {
        signalId: signals[0].id,
        targetUserId: salesUser.id,
        channel: 'IN_APP',
        status: 'READ',
        message: 'TechCorp está contratando - boa oportunidade para prospecção',
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.alert.create({
      data: {
        signalId: signals[1].id,
        targetUserId: adminUser.id,
        channel: 'EMAIL',
        status: 'SENT',
        message: 'InovaSoft recebeu aporte - empresa aquecida para vendas',
        sentAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.alert.create({
      data: {
        signalId: signals[2].id,
        targetUserId: salesUser.id,
        channel: 'SLACK',
        status: 'PENDING',
        message: 'Global Tech expandindo para LATAM - oportunidade de negócio',
      },
    }),
    prisma.alert.create({
      data: {
        signalId: signals[3].id,
        targetUserId: analystUser.id,
        channel: 'IN_APP',
        status: 'DISMISSED',
        message: 'Mudanças na página de carreiras detectadas',
      },
    }),
  ]);

  // Seed Enrichment Runs
  console.log('⚡ Creating enrichment runs...');
  await Promise.all([
    prisma.enrichmentRun.create({
      data: {
        status: 'SUCCEEDED',
        provider: 'Clearbit',
        cost: '0.5000',
        companyId: companies[0].id,
        input: {
          domain: 'techcorp.com.br',
          company_name: 'TechCorp Ltda',
        },
        output: {
          industry: 'Technology',
          employees: 150,
          founded: 2018,
          location: 'São Paulo, Brazil',
        },
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        finishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30000),
      },
    }),
    prisma.enrichmentRun.create({
      data: {
        status: 'SUCCEEDED',
        provider: 'OpenAI',
        cost: '0.1200',
        contactId: contacts[0].id,
        input: {
          linkedin_url: 'https://linkedin.com/in/carlos-silva-cto',
          name: 'Carlos Silva',
        },
        output: {
          seniority: 'C_LEVEL',
          department: 'Technology',
          decision_maker_score: 95,
        },
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        finishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15000),
      },
    }),
    prisma.enrichmentRun.create({
      data: {
        status: 'FAILED',
        provider: 'CustomNLP',
        companyId: companies[4].id,
        input: {
          website: 'med.com.br',
        },
        startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        finishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 5000),
      },
    }),
  ]);

  // Seed Integrations
  console.log('🔗 Creating integrations...');
  await Promise.all([
    prisma.integration.create({
      data: {
        type: 'HUBSPOT',
        name: 'HubSpot CRM Principal',
        active: true,
        config: {
          apiKey: 'hubspot_api_key_example',
          portalId: '12345678',
          syncFields: ['name', 'email', 'company', 'deal_stage'],
          webhook_url: 'https://api.empresa.com/webhooks/hubspot',
        },
      },
    }),
    prisma.integration.create({
      data: {
        type: 'SLACK',
        name: 'Slack Vendas',
        active: true,
        config: {
          webhook_url:
            'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
          channel: '#vendas',
          mention_users: ['@vendedor1', '@gerente-vendas'],
        },
      },
    }),
    prisma.integration.create({
      data: {
        type: 'WEBHOOK',
        name: 'Sistema Interno',
        active: false,
        config: {
          url: 'https://sistema-interno.empresa.com/api/leads',
          method: 'POST',
          headers: {
            Authorization: 'Bearer token_example',
            'Content-Type': 'application/json',
          },
          retry_attempts: 3,
        },
      },
    }),
  ]);

  // Seed Scrape Tasks
  console.log('🕷️ Creating scrape tasks...');
  await Promise.all([
    prisma.scrapeTask.create({
      data: {
        type: 'JOB_BOARD',
        targetUrl:
          'https://linkedin.com/jobs/search/?keywords=desenvolvedor&location=Brasil',
        query: 'desenvolvedor senior react node',
        status: 'SCHEDULED',
        schedule: '0 */6 * * *', // A cada 6 horas
        meta: {
          max_results: 100,
          filters: {
            experience_level: ['mid-senior', 'senior'],
            company_size: ['medium', 'large'],
          },
        },
      },
    }),
    prisma.scrapeTask.create({
      data: {
        type: 'NEWS_FEED',
        query: 'startup funding brasil série A',
        status: 'SCHEDULED',
        lastRunAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        schedule: '0 8 * * *', // Todo dia às 8h
        meta: {
          sources: ['techcrunch', 'exame', 'estadao', 'valor'],
          keywords: ['funding', 'investimento', 'aporte', 'série A', 'série B'],
        },
      },
    }),
    prisma.scrapeTask.create({
      data: {
        type: 'COMPANY_PROFILE',
        targetUrl: 'https://crunchbase.com/organization/techcorp',
        status: 'SUCCEEDED',
        lastRunAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        meta: {
          company_id: companies[0].id,
          fields_to_extract: ['funding_rounds', 'key_people', 'recent_news'],
        },
      },
    }),
    prisma.scrapeTask.create({
      data: {
        type: 'HIRING_PAGE',
        targetUrl: 'https://globaltech.com/careers',
        status: 'RUNNING',
        lastRunAt: new Date(),
        schedule: '0 */2 * * *', // A cada 2 horas
        meta: {
          company_id: companies[3].id,
          monitor_changes: true,
          notify_on_new_jobs: true,
        },
      },
    }),
  ]);

  console.log('✅ Seed completed successfully!');
  console.log(`📊 Created:
  - ${await prisma.user.count()} users
  - ${await prisma.company.count()} companies
  - ${await prisma.contact.count()} contacts
  - ${await prisma.lead.count()} leads
  - ${await prisma.jobPosting.count()} job postings
  - ${await prisma.signal.count()} signals
  - ${await prisma.alert.count()} alerts
  - ${await prisma.enrichmentRun.count()} enrichment runs
  - ${await prisma.integration.count()} integrations
  - ${await prisma.scrapeTask.count()} scrape tasks`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
