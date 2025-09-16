export interface Address {
  id?: string;
  zipcode: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface Phone {
  id?: string;
  type: "LANDLINE" | "MOBILE";
  number: string;
}

export interface ClientCount {
  campaigns: number;
  contracts: number;
}

export interface Client {
  id: string;
  cnpj: string;
  companyName: string;
  fantasyName: string;
  taxpayerType: string;
  stateRegistration?: string;
  typeRelationship?: string;
  addresses: Address[];
  phones: Phone[];
  _count?: ClientCount;
}

export interface ClientListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ClientListResponse {
  data: Client[];
  meta: ClientListMeta;
}

export interface CreateClientRequest {
  cnpj: string;
  companyName: string;
  fantasyName: string;
  taxpayerType: string;
  stateRegistration?: string;
  typeRelationship?: string;
  addresses: Omit<Address, "id" | "isDefault">[];
  phones: Omit<Phone, "id">[];
}

export interface CreateClientResponse {
  data: Client;
}
