import { getContracts, deleteContract } from "@/lib/actions/contracts";
import { ContractsTable } from "./ContractsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contracts - VISTAR Real Estate",
};

interface ContractsPageProps {
  searchParams: Promise<{ page?: string; search?: string; delete?: string }>;
}

export default async function ContractsPage({ searchParams }: ContractsPageProps) {
  const params = await searchParams;
  const { page = "1", search = "", delete: deleteId } = params;
  const pageNum = parseInt(page, 10) || 1;

  if (deleteId) {
    await deleteContract(deleteId);
  }

  const { data: contracts, count } = await getContracts(pageNum, 10, search);

  const handleDelete = (id: string) => {
    window.location.href = `/dashboard/contracts?page=${pageNum}${search ? `&search=${search}` : ""}&delete=${id}`;
  };

  return <ContractsTable contracts={contracts} count={count} pageNum={pageNum} search={search} />;
}