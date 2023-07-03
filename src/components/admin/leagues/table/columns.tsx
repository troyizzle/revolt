import { zodResolver } from "@hookform/resolvers/zod";
import { type League} from "@prisma/client";
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
import { type UpdateLeagueSchema, updateLeagueSchema } from "~/schema/league";
import { api } from "~/utils/api";

type LeagueFormProps = {
  league: League
  children: React.ReactNode
}

function LeagueForm({ league, children }: LeagueFormProps) {
  const ctx = api.useContext()

  const { mutate } = api.league.update.useMutation({
    onSuccess: async () => {
      toast.success("League updated")
      await ctx.league.getAll.invalidate()
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const form = useForm<UpdateLeagueSchema>({
    resolver: zodResolver(updateLeagueSchema),
    defaultValues: {
      ...league
    }
  })

  function onSubmit(data: UpdateLeagueSchema) {
    mutate({
      ...data,
    })
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
                Your name will be displayed publicly.
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

export const columns: ColumnDef<League>[] = [
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
              <DialogTitle>Edit League</DialogTitle>
              <DialogDescription>
                Make changes to the League.
              </DialogDescription>
            </DialogHeader>
            <LeagueForm league={row.original}>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button type="submit" variant="default">Submit</Button>
                </DialogTrigger>
              </DialogFooter>
            </LeagueForm>
          </DialogContent>
        </Dialog>
      )
    }
  }
]
