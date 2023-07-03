import { zodResolver } from "@hookform/resolvers/zod";
import { type ColumnDef } from "@tanstack/react-table";
import { type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type SeasonWithLeague } from "~/pages/admin/seasons";
import { type UpdateSeasonSchema, updateSeasonSchema } from "~/schema/season";
import { api } from "~/utils/api";

type SeasonFormProps = {
  season: SeasonWithLeague[0]
  children: React.ReactNode
}

function SeasonForm({ season, children }: SeasonFormProps) {
  const ctx = api.useContext()
  const { mutate } = api.season.update.useMutation({
    onSuccess: async () => {
      toast.success("Season updated")
      await ctx.season.getAll.invalidate()
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const form = useForm<UpdateSeasonSchema>({
    resolver: zodResolver(updateSeasonSchema),
    defaultValues: {
      ...season,
      endDate: !season.endDate ? undefined : season.endDate
    }
  })

  function onSubmit(data: UpdateSeasonSchema) {
    mutate(data)
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    await form.handleSubmit(onSubmit)(event)
  }

  return (
    <Form {...form}>
      <form className="flex flex-col space-y-3" onSubmit={(event) => {
        event.preventDefault()
        void handleFormSubmit(event)
      }}>
        <Input type="hidden" {...form.register("id")} />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>
                This season name wiill be publicly displayed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  )
}

export const columns: ColumnDef<SeasonWithLeague[0]>[] = [
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
    accessorKey: "League.name",
    header: "League"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Icons.horizontalThreeDots className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DialogTrigger asChild>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Season</DialogTitle>
              <DialogDescription>
                Make changes to the season.
              </DialogDescription>
            </DialogHeader>
            <SeasonForm season={row.original}>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button type="submit" variant="default">Submit</Button>
                </DialogTrigger>
              </DialogFooter>
            </SeasonForm>
          </DialogContent>
        </Dialog>
      )
    }
  }
]
