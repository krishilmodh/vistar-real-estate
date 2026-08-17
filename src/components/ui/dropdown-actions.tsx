"use client";

import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DropdownActionsProps {
  entityId: string;
  entityType: "property" | "contract" | "customer" | "flat" | "payment" | "rent";
  onDelete: () => Promise<void>;
}

const entityRoutes: Record<string, { list: string; edit: string }> = {
  property: { list: "/dashboard/properties", edit: "/dashboard/properties" },
  contract: { list: "/dashboard/contracts", edit: "/dashboard/contracts" },
  customer: { list: "/dashboard/customers", edit: "/dashboard/customers" },
  flat: { list: "/dashboard/flats", edit: "/dashboard/flats" },
  payment: { list: "/dashboard/payments", edit: "/dashboard/payments" },
  rent: { list: "/dashboard/rent", edit: "/dashboard/rent" },
};

export function DropdownActions({ entityId, entityType, onDelete }: DropdownActionsProps) {
  const router = useRouter();
  const routes = entityRoutes[entityType];

  const handleEdit = () => {
    router.push(`${routes.edit}/${entityId}/edit`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      await onDelete();
      router.push(routes.list);
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit} className="flex items-center gap-2 cursor-pointer">
          <Edit className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 flex items-center gap-2 cursor-pointer" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}