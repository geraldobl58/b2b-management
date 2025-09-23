export interface Client {
  id: string;
  companyName: string;
  fantasyName: string;
  cnpj: string;
}

export interface Contact {
  personId: string;
  role: "CAMPAIGN_MANAGER" | "ADMIN" | "USER";
}

export interface ContactResponse extends Contact {
  id: string;
  campaignId: string;
  createdAt: string;
  person: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface Business {
  paymentMethod: "CREDIT_CARD" | "BANK_TRANSFER" | "PIX" | "BOLETO";
  upfront: boolean;
  daysToInvoice: number;
  notes: string;
  billingModel: string;
  estimateMonthly: number;
  estimateAnnual: number;
  autoInvoicing: boolean;
  priceCycle: "MONTHLY" | "QUARTERLY" | "YEARLY";
  deliveryType: "DIGITAL" | "PHYSICAL" | "HYBRID";
  additional: boolean;
  daysToDeliver: number;
  chargeFreight: boolean;
  b2b: boolean;
}

export interface BusinessResponse extends Business {
  id: string;
  campaignId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Config {
  contractPending: boolean;
  orderConfirmationEnabled: boolean;
  confirmationTimeMinutes: number;
  differentialFlow: boolean;
  blockOrdersDuringCampaign: boolean;
  delinquencyPolicy: string;
}

export interface ConfigResponse extends Config {
  id: string;
  campaignId: string;
  createdAt: string;
  updatedAt: string;
}

// Input interfaces for creation/update
export interface CreateCampaignData {
  name: string;
  startDate: string;
  endDate: string;
  city: string;
  type: "MKT" | "SALES" | "RETENTION" | "UPSELL";
  branchType: "MATRIZ" | "FILIAL";
  observations?: string;
  clientId: string;
  contractId: string;
  contacts: Contact[];
  business: Business;
  config: Config;
}

export interface UpdateCampaignData extends Partial<CreateCampaignData> {
  id: string;
}

// Response interface
export interface Campaign {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  city: string;
  type: "MKT" | "SALES" | "RETENTION" | "UPSELL";
  branchType: "MATRIZ" | "FILIAL";
  observations: string | null;
  clientId: string;
  contractId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  client: Client;
  contract: string | null;
  contacts: ContactResponse[];
  business: BusinessResponse;
  config: ConfigResponse;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CampaignListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CampaignListResponse {
  data: Campaign[];
  meta: CampaignListMeta;
}
