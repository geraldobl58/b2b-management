export interface ContractCount {
  campaigns: number;
}

export interface Contract {
  id: string;
  clientId: string;
  name: string;
  partner: string;
  startDate: string;
  endDate: string;
  clientName: string;
  _count: ContractCount;
}

export interface ContractListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ContractListResponse {
  data: Contract[];
  meta: ContractListMeta;
}

export interface CreateContractRequest {
  clientId: string;
  name: string;
  partner: string;
  startDate: string;
  endDate: string;
}

export interface CreateContractResponse {
  data: Contract;
}

export interface ContractWithRelations extends Contract {
  campaigns?: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    type: string;
  }>;
  client?: {
    id: string;
    companyName: string;
    fantasyName: string;
    cnpj: string;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
