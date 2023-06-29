import Papa, { ParseResult } from 'papaparse'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { SelectContent } from '~/components/ui/select'
import { SelectValue } from '~/components/ui/select'
import { SelectTrigger } from '~/components/ui/select'
import { SelectItem } from '~/components/ui/select'
import { Select } from '~/components/ui/select'
import { RaceCsvResults } from '~/schema/race'
import { api } from '~/utils/api'
import { CsvResult, parseCsvData } from '~/utils/sessionCsvParser'

export default function AdminPage() {
  const [parsedData, setParsedData] = useState<RaceCsvResults| null>(null)

  const { mutate } = api.race.create.useMutation({
    onSuccess: (data) => {
      console.log('success', data)
    },
    onError: (error) => {
      console.log('error', error)
    },
    onMutate: (data) => {
      console.log('mutate', data)
    }
  })

  function handleFileChange(event: any) {
    const file = event.target.files[0]
    Papa.parse(file, {
      complete: function(results: ParseResult<RaceCsvResults>) {
        mutate({ results, eventId: '1' })
        //setParsedData(parseCsvData(results.data))
      }
    })
  }

  function onSubmit(data: any) {
    alert(data)
  }

  const form = useForm<any>({
  })

  console.log(form.formState)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {JSON.stringify(form.formState)}
      <Input
        type="file"
        accept=".csv"
        {...form.register('file')}
        onChange={handleFileChange}
      />
      <Select
        {...form.register('eventId')}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Event 1</SelectItem>
        </SelectContent>
      </Select>
      {!parsedData && <div>Upload a file to continue</div>}
      <Button type="submit" variant="default">Submit</Button>
    </form>
  )
}
