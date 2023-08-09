import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import AdminNewModal from "~/components/admin/modal/new"
import { FormField, FormLabel, FormItem, FormMessage, FormDescription } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { type SuggestionNewInput, suggestionNewSchema } from "~/schema/suggestion"
import { api } from "~/utils/api"

type SuggestionNewFormProps = {
  open: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SuggestionNewForm({ open, setIsOpen }: SuggestionNewFormProps) {
  const { mutate } = api.suggestion.create.useMutation({
    onSuccess: () => {
      toast.success("Suggestion created")
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  function onSubmit(data: SuggestionNewInput) {
    mutate(data)
  }

  const form = useForm<SuggestionNewInput>({
    resolver: zodResolver(suggestionNewSchema)
  })

  return (
    <AdminNewModal
      form={form}
      onSubmit={onSubmit}
      modalTitle="New Suggestion"
      modalDescription="Create a new suggestion"
      open={open}
      setIsOpen={setIsOpen}
      renderCreateButton={false}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <Input {...field} />
            <FormDescription>
              Enter your name, this is optional.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Message</FormLabel>
            <Textarea {...field} rows={10} />
            <FormDescription>
              Please enter what you think would be useful.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </AdminNewModal>
  )
}
