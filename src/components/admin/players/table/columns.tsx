import { type Player } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { Icons } from "~/components/icons"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { api } from "~/utils/api"

export default function getColumnDef(): ColumnDef<Player>[] {
  const ctx = api.useContext()

  const { mutate: deleteMutate } = api.player.delete.useMutation({
    onSuccess: async () => {
      toast.success('Player deleted')
      await ctx.player.getAll.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return [
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
      id: "actions",
      cell: ({ row }) => {
        return (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Icons.horizontalThreeDots className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent className="sm:max-w-[425px]">
              <AlertDialogHeader>
                <AlertDialogTitle>Remove {row.original.name}</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this
                  player and remove their related data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteMutate({ id: row.original.id })
                  }}
                >Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      }
    }
  ]
}
