import { getCustomers, deleteCustomer } from "@/lib/actions/customers";
import { CustomersTable } from "./CustomersTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers - VISTAR Real Estate",
};

interface CustomersPageProps {
  searchParams: Promise<{ page?: string; search?: string; delete?: string }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;
  const { page = "1", search = "", delete: deleteId } = params;
  const pageNum = parseInt(page, 10) || 1;

  if (deleteId) {
    await deleteCustomer(deleteId);
  }

  const { data: customers, count } = await getCustomers(pageNum, 10, search);

  const handleDelete = (id: string) => {
    window.location.href = `/dashboard/customers?page=${pageNum}${search ? `&search=${search}` : ""}&delete=${id}`;
  };

  return <CustomersTable customers={customers} count={count} pageNum={pageNum} search={search} />;
}