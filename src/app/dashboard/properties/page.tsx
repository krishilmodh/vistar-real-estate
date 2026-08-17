import { getProperties, deleteProperty } from "@/lib/actions/properties";
import { PropertiesTable } from "./PropertiesTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties - VISTAR Real Estate",
};

interface PropertiesPageProps {
  searchParams: Promise<{ page?: string; search?: string; delete?: string }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const { page = "1", search = "", delete: deleteId } = params;
  const pageNum = parseInt(page, 10) || 1;

  if (deleteId) {
    await deleteProperty(deleteId);
  }

  const { data: properties, count } = await getProperties(pageNum, 10, search);

  return <PropertiesTable properties={properties} count={count} pageNum={pageNum} search={search} />;
}