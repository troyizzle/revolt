import Papa, { ParseResult } from 'papaparse'
import { api } from '~/utils/api'
import { CsvResult, parseCsvData } from '~/utils/sessionCsvParser'

export default function AdminPage() {
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

  function handleFileChange(event) {
    const file = event.target.files[0]
    console.log("doing something")
    Papa.parse(file, {
      complete: function(results: ParseResult<CsvResult>) {
        //mutate(parseData(results.data))
        const parsed = parseCsvData(results.data)
        mutate(parsed)
      }
    })
  }

  return (
    <>
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={handleFileChange}
      />
    </>
  )
}
