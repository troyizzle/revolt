import { zodResolver } from "@hookform/resolvers/zod"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { type User, getServerSession } from "next-auth"
import { useRouter } from "next/router"
import Papa, { type ParseResult } from "papaparse"
import { type FormEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { type AddRaceResultsInput, addRaceResultsInput } from "~/schema/race"
import { authOptions } from "~/server/auth"
import { api } from "~/utils/api"
import { type CsvResult, parseCsvData } from "~/utils/importSessionData"

export default function EventRacePage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [loadedCsv, setLoadedCsv] = useState<csvState>('idle')
    const router = useRouter()
    const eventId = router.query.id as string;

    const form = useForm<AddRaceResultsInput>({
      resolver: zodResolver(addRaceResultsInput),
      defaultValues: {
        eventId: eventId,
      }
    })

    if (!eventId) return null

    type csvState = 'idle' | 'loading' | 'loaded' | 'error'

    const { mutate } = api.race.create.useMutation({
      onSuccess: async () => {
        await router.push("/admin/events")
        toast.success('Race linked to event')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })

    function onSubmit(data: AddRaceResultsInput) {
      mutate(data)
    }

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
      await form.handleSubmit(onSubmit)(event);
    };

    return (
      <div className="container mx-auto">
        <Form {...form}>
          <form onSubmit={(event) => {
            event.preventDefault();
            void handleFormSubmit(event);
          }}>
            <Input type="hidden" value={eventId} {...form.register('eventId')} />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".csv"
                      placeholder="Select a file"
                      {...field}
                      onChange={(event) => {
                        const file = event?.target?.files?.[0]
                        if (file === undefined) return
                        setLoadedCsv('loading')

                        Papa.parse(file, {
                          complete: function(results: ParseResult<CsvResult>) {
                            const parsedData = parseCsvData(results.data)
                            form.setValue('map', parsedData.map);
                            form.setValue('laps', parsedData.laps);
                            form.setValue('results', parsedData.results);

                            setLoadedCsv('loaded')
                          },
                          error: function(error) {
                            console.error(error)
                            setLoadedCsv('error')
                          }
                        })
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    This file is the session csv results
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loadedCsv == 'loaded' && (
              <>
                <FormField
                  control={form.control}
                  name="map"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Map</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Map"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="laps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Laps</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Laps"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3">
                  {Array.from(form.getValues('results')).map((_result, index) => (
                    <Card key={index} className="p-2">
                      <FormField
                        control={form.control}
                        name={`results.${index}.player`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Player</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Player"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`results.${index}.position`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Position"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`results.${index}.car`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Car</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Car"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`results.${index}.time`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Time"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`results.${index}.bestLap`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Best Lap</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Best Lap"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    className="mt-2"
                    size="lg"
                    type="submit" variant="default">Submit</Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </div >
    )
  }

  export const getServerSideProps: GetServerSideProps<{ user: User }> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session || !session.user.isAdmin) {
      return {
        redirect: {
          destination: '/?errorMessage=You are not an admin',
          permanent: false,
        },
      }
    }

    return {
      props: {
        user: session.user
      },
    }
  }
