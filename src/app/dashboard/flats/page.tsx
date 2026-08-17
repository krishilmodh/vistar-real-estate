import { getFlats, deleteFlat } from "@/lib/actions/flats";
import { FlatsTable } from "./FlatsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flats - VISTAR Real Estate",
};

interface FlatsPageProps {
  searchParams: Promise<{ page?: string; search?: string; delete?: string }>;
}

export default async function FlatsPage({ searchParams }: FlatsPageProps) {
  const params = await searchParams;
  const { page = "1", search = "", delete: deleteId } = params;
  const pageNum = parseInt(page, 10) || 1;

  if (deleteId) {
    await deleteFlat(deleteId);
  }

  const { data: flats, count } = await getFlats(pageNum, 10, search);

  const handleDelete = (id: string) => {
    window.location.href = `/dashboard/flats?page=${pageNum}${search ? `&search=${search}` : ""}&delete=${id}`;
  };

  return <FlatsTable flats={flats} count={count} pageNum={pageNum} search={search} />;
}