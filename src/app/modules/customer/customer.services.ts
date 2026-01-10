// src/modules/customer/customer.service.ts
import { CustomerCreateInput, CustomerUpdateInput } from "./customer.interface";
import { Customer } from "./customer.model";

type TListQuery = {
  searchTerm?: string;
  page?: number;
  limit?: number;
  onlyActive?: boolean; // default true
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeSpaces = (s?: string) => (s ?? "").trim().replace(/\s+/g, " ");

const clampInt = (n: unknown, def: number, min: number, max: number) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return def;
  const i = Math.trunc(num);
  return Math.min(max, Math.max(min, i));
};

const buildSearchFilter = (searchTerm?: string) => {
  const term = normalizeSpaces(searchTerm);
  if (!term) return {};

  const safe = escapeRegex(term);
  const re = new RegExp(safe, "i");

  const digits = term.replace(/[^\d]/g, "");
  const phoneRe = digits ? new RegExp(escapeRegex(digits), "i") : null;

  return {
    $or: [
      { uuid: re },
      { fullName: re },
      ...(phoneRe ? [{ phone: phoneRe }] : []),
    ],
  };
};

/**
 * CREATE
 */
const createCustomerIntoDB = async (payload: CustomerCreateInput) => {
  // uuid is auto-generated in model pre-save
  return Customer.create(payload);
};

/**
 * FETCH ALL (quick)
 * Returns only: uuid, fullName, phone
 * Supports searchTerm + pagination
 */
const getAllCustomersFromDB = async (query: TListQuery = {}) => {
  const page = clampInt(query.page, 1, 1, 1_000_000);
  const limit = clampInt(query.limit, 20, 1, 100);
  const skip = (page - 1) * limit;

  const onlyActive = query.onlyActive ?? true;
  const baseFilter = onlyActive ? { isActive: true } : {};
  const searchFilter = buildSearchFilter(query.searchTerm);

  const filter = { ...baseFilter, ...searchFilter };

  const [meta, result] = await Promise.all([
    Customer.countDocuments(filter),
    Customer.find(filter)
      .select({ uuid: 1, fullName: 1, phone: 1, _id: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  return {
    meta: { page, limit, total: meta },
    result,
  };
};

/**
 * FETCH SINGLE
 * Supports lookup by uuid
 * (If you want to support _id too, tell me and I’ll add it without breaking structure.)
 */
const getSingleCustomerFromDB = async (uuid: string) => {
  return Customer.findOne({ uuid });
};

/**
 * UPDATE
 * Updates by uuid
 */
const updateCustomerIntoDB = async (
  uuid: string,
  payload: CustomerUpdateInput
) => {
  return Customer.findOneAndUpdate({ uuid }, payload, {
    new: true,
    runValidators: true,
    context: "query",
  });
};

/**
 * DELETE
 * Hard delete by uuid
 * (If you prefer soft delete: set isActive=false instead.)
 */
const deleteCustomerFromDB = async (uuid: string) => {
  return Customer.findOneAndDelete({ uuid });
};

export const customerServices = {
  createCustomerIntoDB,
  getAllCustomersFromDB,
  getSingleCustomerFromDB,
  updateCustomerIntoDB,
  deleteCustomerFromDB,
};
