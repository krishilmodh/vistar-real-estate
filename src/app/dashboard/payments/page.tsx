import { getPayments, deletePayment } from "@/lib/actions/payments";
import { PaymentsTable } from "./PaymentsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments - VISTAR Real Estate",
};

interface PaymentsPageProps {
  searchParams: Promise<{ page?: string; search?: string; method?: string; month?: string; delete?: string }>;
}

export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {
  const params = await searchParams;
  const { page = "1", search = "", method = "all", month = "all", delete: deleteId } = params;
  const pageNum = parseInt(page, 10) || 1;

  if (deleteId) {
    await deletePayment(deleteId);
  }

  const { data: payments, count } = await getPayments(pageNum, 10, search, method, month);

  const handleDelete = (id: string) => {
    const params = new URLSearchParams({ page: pageNum.toString() });
    if (search) params.set("search", search);
    if (method !== "all") params.set("method", method);
    if (month !== "all") params.set("month", month);
    params.set("delete", id);
    window.location.href = `/dashboard/payments?${params.toString()}`;
  };

  return <PaymentsTable payments={payments} count={count} pageNum={pageNum} search={search} method={method} month={month} />;
}