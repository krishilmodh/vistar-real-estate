import { getMonthlyRents, deleteMonthlyRent } from "@/lib/actions/rent";
import { RentTable } from "./RentTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monthly Rent - VISTAR Real Estate",
};

interface RentPageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string; month?: string; delete?: string }>;
}

export default async function RentPage({ searchParams }: RentPageProps) {
  const params = await searchParams;
  const { page = "1", search = "", status = "all", month = "all", delete: deleteId } = params;
  const pageNum = parseInt(page, 10) || 1;

  if (deleteId) {
    await deleteMonthlyRent(deleteId);
  }

  const { data: rentRecords, count } = await getMonthlyRents(pageNum, 10, search, status, month);

  const handleDelete = (id: string) => {
    const params = new URLSearchParams({ page: pageNum.toString() });
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    if (month !== "all") params.set("month", month);
    params.set("delete", id);
    window.location.href = `/dashboard/rent?${params.toString()}`;
  };

  return <RentTable rentRecords={rentRecords} count={count} pageNum={pageNum} search={search} status={status} month={month} />;
}