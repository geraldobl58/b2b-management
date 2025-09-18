/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient, Role, TaxpayerType, PhoneType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper to generate Brazilian CNPJ
function generateCNPJ(): string {
  // Generate unique 8-digit number
  const digits = Array.from({ length: 8 }, () =>
    faker.number.int({ min: 0, max: 9 }),
  );
  const branch = faker.string.numeric(4); // Make branch random too
  const base = digits.join('') + branch;

  // Calculate verification digits (simplified)
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const sum1 = base
    .split('')
    .reduce((sum, digit, index) => sum + parseInt(digit) * weights1[index], 0);
  const digit1 = sum1 % 11 < 2 ? 0 : 11 - (sum1 % 11);

  const sum2 = (base + digit1)
    .split('')
    .reduce((sum, digit, index) => sum + parseInt(digit) * weights2[index], 0);
  const digit2 = sum2 % 11 < 2 ? 0 : 11 - (sum2 % 11);

  return `${digits.slice(0, 2).join('')}.${digits.slice(2, 5).join('')}.${digits.slice(5, 8).join('')}/${branch}-${digit1}${digit2}`;
}

// Helper to generate Brazilian phone
function generateBrazilianPhone(): string {
  const ddd = faker.helpers.arrayElement([
    '11',
    '21',
    '31',
    '41',
    '51',
    '61',
    '71',
    '81',
    '91',
  ]);
  const number = faker.string.numeric(8);
  return `(${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`;
}

// Helper to generate Brazilian mobile phone
function generateBrazilianMobile(): string {
  const ddd = faker.helpers.arrayElement([
    '11',
    '21',
    '31',
    '41',
    '51',
    '61',
    '71',
    '81',
    '91',
  ]);
  const number = '9' + faker.string.numeric(8);
  return `(${ddd}) ${number.slice(0, 5)}-${number.slice(5)}`;
}

// Helper to generate Brazilian zipcode
function generateZipcode(): string {
  return faker.string.numeric(5) + '-' + faker.string.numeric(3);
}

async function main() {
  console.log('🌱 Starting seed with faker data...');

  // Clear existing data in proper order (contracts first due to foreign keys)
  await prisma.contract.deleteMany();
  console.log('🗑️ Cleared existing contracts');

  await prisma.client.deleteMany();
  console.log('🗑️ Cleared existing clients');

  const defaultPassword = await bcrypt.hash('MyPass123!', 10);

  // Create test users for each role
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: faker.person.fullName(),
      password: defaultPassword,
      role: Role.ADMIN,
    },
  });

  const business = await prisma.user.upsert({
    where: { email: 'business@example.com' },
    update: {},
    create: {
      email: 'business@example.com',
      name: faker.person.fullName(),
      password: defaultPassword,
      role: Role.BUSINESS,
    },
  });

  const teamMember = await prisma.user.upsert({
    where: { email: 'team@example.com' },
    update: {},
    create: {
      email: 'team@example.com',
      name: faker.person.fullName(),
      password: defaultPassword,
      role: Role.TEAM_MEMBER,
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: {},
    create: {
      email: 'viewer@example.com',
      name: faker.person.fullName(),
      password: defaultPassword,
      role: Role.VIEWER,
    },
  });

  const users = [admin, business];
  const createdClients: any[] = [];
  const usedCNPJs = new Set<string>();

  // Create 50 fake clients
  for (let i = 0; i < 50; i++) {
    let cnpj = generateCNPJ();
    // Ensure unique CNPJ
    while (usedCNPJs.has(cnpj)) {
      cnpj = generateCNPJ();
    }
    usedCNPJs.add(cnpj);
    const companyName = faker.company.name() + ' LTDA';
    const fantasyName = faker.company.name();
    const taxpayerType = faker.helpers.arrayElement(
      Object.values(TaxpayerType),
    );
    const creator = faker.helpers.arrayElement(users);

    // Generate 1-3 addresses
    const addressCount = faker.number.int({ min: 1, max: 3 });
    const addresses = Array.from({ length: addressCount }, (_, index) => ({
      zipcode: generateZipcode(),
      street: faker.location.streetAddress(),
      number: faker.location.buildingNumber(),
      complement: faker.datatype.boolean()
        ? faker.location.secondaryAddress()
        : undefined,
      district: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      isDefault: index === 0,
    }));

    // Generate 1-4 phones
    const phoneCount = faker.number.int({ min: 1, max: 4 });
    const phones = Array.from({ length: phoneCount }, () => ({
      type: faker.helpers.arrayElement(Object.values(PhoneType)),
      number: faker.helpers.arrayElement([
        generateBrazilianPhone(),
        generateBrazilianMobile(),
      ]),
    }));

    try {
      const client = await prisma.client.create({
        data: {
          cnpj,
          companyName,
          fantasyName,
          taxpayerType,
          stateRegistration: faker.datatype.boolean()
            ? faker.string.numeric(9)
            : undefined,
          typeRelationship: faker.helpers.arrayElement([
            'Cliente Premium',
            'Parceiro Estratégico',
            'Cliente Regular',
            'Fornecedor',
            'Distribuidor',
          ]),
          createdById: creator.id,
          addresses: {
            create: addresses,
          },
          phones: {
            create: phones,
          },
        },
        include: {
          addresses: true,
          phones: true,
        },
      });

      createdClients.push(client);
      console.log(`✓ Created client ${i + 1}: ${companyName}`);
    } catch (error) {
      console.warn(
        `Failed to create client ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // Create contracts for some of the clients
  const createdContracts: any[] = [];
  console.log('\n📋 Creating contracts...');

  // Create 20-30 contracts for random clients
  const contractCount = faker.number.int({ min: 20, max: 30 });

  for (let i = 0; i < contractCount; i++) {
    const randomClient = faker.helpers.arrayElement(createdClients);
    const creator = faker.helpers.arrayElement(users);

    // Generate contract dates (start date in the past or near future, end date later)
    const startDate = faker.date.between({
      from: new Date('2023-01-01'),
      to: new Date('2025-12-31'),
    });

    const endDate = faker.date.between({
      from: startDate,
      to: new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000 * 2), // 2 years from start
    });

    const contractNames = [
      'Contrato de Marketing Digital',
      'Acordo de Parceria Comercial',
      'Contrato de Fornecimento',
      'Acordo de Distribuição',
      'Contrato de Serviços',
      'Parceria Estratégica',
      'Contrato de Vendas',
      'Acordo de Colaboração',
      'Contrato de Publicidade',
      'Acordo de Representação',
    ];

    const partnerNames = [
      'Google Brasil',
      'Meta Publicidade',
      'Amazon Web Services',
      'Microsoft Brasil',
      'Salesforce',
      'HubSpot',
      'Adobe Brasil',
      'Oracle',
      'SAP Brasil',
      'IBM Brasil',
    ];

    try {
      const contract = await prisma.contract.create({
        data: {
          name: `${faker.helpers.arrayElement(contractNames)} ${faker.number.int({ min: 1000, max: 9999 })}`,
          partner: faker.helpers.arrayElement(partnerNames),
          startDate,
          endDate,
          clientId: randomClient.id,
          createdById: creator.id,
        },
        include: {
          client: {
            select: {
              companyName: true,
              fantasyName: true,
            },
          },
        },
      });

      createdContracts.push(contract);
      console.log(
        `✓ Created contract ${i + 1}: ${contract.name} for ${contract.client.companyName}`,
      );
    } catch (error) {
      console.warn(
        `Failed to create contract ${i + 1}:`,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  console.log('✅ Seed completed successfully with faker data!');
  console.log('\n👥 Created users:');
  console.log(
    `- Admin: admin@example.com (${admin.name}) - password: MyPass123!`,
  );
  console.log(
    `- Business: business@example.com (${business.name}) - password: MyPass123!`,
  );
  console.log(
    `- Team Member: team@example.com (${teamMember.name}) - password: MyPass123!`,
  );
  console.log(
    `- Viewer: viewer@example.com (${viewer.name}) - password: MyPass123!`,
  );
  console.log('\n🏢 Created clients:');
  console.log(`- Generated ${createdClients.length} clients with faker data`);
  console.log(
    '- Companies from various industries with realistic Brazilian data',
  );
  console.log('- Multiple addresses and phone numbers per client');
  console.log('- Realistic CNPJs, phone numbers, and addresses');

  console.log('\n📋 Created contracts:');
  console.log(`- Generated ${createdContracts.length} contracts`);
  console.log('- Random assignment to clients');
  console.log('- Realistic contract names and partner companies');
  console.log('- Valid date ranges (start and end dates)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
