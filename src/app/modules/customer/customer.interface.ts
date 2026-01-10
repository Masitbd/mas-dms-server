// types/customer.ts
export type CustomerType = "Regular" | "Patient" | "Corporate";
export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

export type CustomerAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
};

export type CustomerMedical = {
  allergies?: string;
  chronicConditions?: string;
};

export type Customer = {
  _id: string;
  uuid: string; // e.g., CUST-000123 (auto generated)

  customerType: CustomerType;

  fullName: string;
  phone: string;
  email?: string;

  dateOfBirth?: string | null;
  gender?: Gender;
  nidOrPassport?: string;

  address?: CustomerAddress;

  loyaltyId?: string;

  allowCredit: boolean;
  creditLimit: number;
  discountPercent?: number | null;

  medical?: CustomerMedical;

  notes?: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
};

// Frontend should NOT send uuid; backend assigns it.
export type CustomerCreateInput = Omit<
  Customer,
  "_id" | "uuid" | "createdAt" | "updatedAt"
>;
export type CustomerUpdateInput = Partial<CustomerCreateInput>;
