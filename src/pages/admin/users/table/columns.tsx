import { zodResolver } from "@hookform/resolvers/zod";
import { type User } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type UserUpdateSchema, userUpdateSchema } from "~/schema/user";
import { api } from "~/utils/api";

type UserFormProps = {
  user: User
  children: React.ReactNode
}

function UserForm({ user, children }: UserFormProps) {
  const ctx = api.useContext()
  const { mutate } = api.user.update.useMutation({
    onSuccess: async () => {
      toast.success("User updated")
      await ctx.user.getAll.invalidate()
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const form = useForm<UserUpdateSchema>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name || "",
      isAdmin: user.isAdmin,
      id: user.id,
      email: user.email || "",
    }
  })

  function onSubmit(data: UserUpdateSchema) {
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>
                Your email will be displayed publicly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    return checked ? field.onChange(true) : field.onChange(false)
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Admin
                </FormLabel>
                <FormDescription>
                  This will set the user to an admin.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  )
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Email
          <Icons.chevronUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "isAdmin",
    header: "Admin",
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
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Make changes to the user.
              </DialogDescription>
            </DialogHeader>
            <UserForm user={row.original}>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button type="submit" variant="default">Submit</Button>
                </DialogTrigger>
              </DialogFooter>
            </UserForm>
          </DialogContent>
        </Dialog>
      )
    }
  }
]
