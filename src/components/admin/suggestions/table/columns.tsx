import { type Suggestion } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";

export const columns: ColumnDef<Suggestion>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Name
          <Icons.chevronUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "message",
    header: "message",
  }
]
