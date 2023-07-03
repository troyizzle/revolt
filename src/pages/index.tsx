import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Header } from "~/components/header";
import { Shell } from "~/components/shell";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  const heroImages = [
    {
      title: "Hero Image One",
      src: "/images/hero-image1.png",
    },
    {
      title: "Hero Iamge Two",
      src: "/images/RVCCoverlay.png",
    },
    {
      title: "Hero Image Three",
      src: "/images/revolt-default.jpg",
    }
  ]

  return (
    <div
      role="region"
      aria-label="Hero"
      aria-roledescription="carousel"
      aria-live="polite"
      aria-atomic="true"
      aria-relevant="additions removals"
      aria-describedby="hero-carousel"
      className="relative"
    >
      <AspectRatio ratio={16 / 9}>
        <div className="absolute inset-0 z-10 bg-black/60" />
        <Image
          src={heroImages[currentImage]?.src ?? "/images/hero-image1.png"}
          alt={heroImages[currentImage]?.title ?? "Hero Image One"}
          fill
          className="object-cover"
        />
      </AspectRatio>
      <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center gap-2 pb-2">
        {heroImages.map((image, index) => (
          <Button
            key={image.title}
            className={cn(
              "h-1.5 w-10 rounded-none p-0 hover:bg-white",
              index === currentImage ? "bg-white" : "bg-zinc-500"
            )}
            onClick={() => setCurrentImage(index)}
          >
            <span className="sr-only">
              Slide {index + 1} of {heroImages.length}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  const router = useRouter()
  const errorMessage = router.query.errorMessage as string

  useEffect(() => {
    if (!errorMessage) return
    toast.error(errorMessage)
  }, [errorMessage])

  return (
    <>
      <Head>
        <title>Revolt</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="revolt" />
        <meta
          property="og:url"
          content=""
        />
        <meta property="og:description" content="Revolt season is a community of people who love to play games together." />
        <meta property="og:image" content="/images/revolt-default.jpg" />
      </Head>
      <main>
        <Hero />
        <Shell>
          <Header
            className="place-items-center text-center"
            title="Re-Volt Endurance Championship Season 4: Total Standings"
            description="The RVEC is the premier event of the year for hardcore Endurance enthusiasts."
          />
          <div className="space-y-5">
            <Card className="w-full block md:flex mt-4 px-6 py-20">
              <div className="sm:w-full md:w-1/2 lg:w-3/4 grow">
                <Image
                  src="/images/championship.png"
                  alt="Revolt Championship"
                  width={500}
                  height={500}
                  className="object-cover"
                />
              </div>
              <div className="ml-3">
                <h2 className="text-2xl font-medium">Endurance Championship</h2>
                <p>If you would like to participate in this season please reach out to frosttbitten on Discord</p>
                <p className="mb-2">Click here to see the current leaderboard for this season.</p>
                <Link
                  aria-label="Leaderboard"
                  href="/leaderboard"
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "h-8 w-full md:w-1/2 rounded-sm mb-2",
                  })}
                >
                  Leaderboard
                </Link>
              </div>
            </Card>

            <Card className="w-full block md:flex mt-4 px-6 py-20">
              <div className="ml-3">
                <h2 className="text-2xl font-medium mb-1">Rules</h2>
                <p>RVEC uses the Moto GP points system, detailed by the graphic on the right.</p>
                <p>Additionally, racers are awarded for having the Best Lap in the race. Overall Best Lap earns 3 extra points, 2nd Best earns 2, and 3rd Best scores 1 extra point.</p>
              </div>

              <div className="ml-2 sm:w-full md:w-1/2 lg:w-3/4 grow">
                <Image
                  src="/images/rules.png"
                  alt="Revolt Rules"
                  width={500}
                  height={500}
                  className="object-cover"
                />
              </div>
            </Card>


            <Card className="w-full block md:flex mt-4 px-6 py-20">
              <div className="sm:w-full md:w-1/2 lg:w-3/4 grow">
                <Image
                  src="/images/revolt-stream.png"
                  alt="Revolt Stream"
                  width={500}
                  height={500}
                  className="object-cover"
                />
              </div>
              <div className="ml-2">
                <h2 className="text-2xl font-medium">Live Streams</h2>
                <p className="py-6">his season is live broadcasted right on <Link
                  className="text-blue-500 hover:text-blue-600"
                  target="_blank"
                  href="https://www.twitch.tv/revoltunited">Twitch</Link> to Re-Volt's competitive community every Sunday starting at around 18:45 UTC, with the official race beginning around 19:30 UTC. It is commentated by Re-Volt's shoutcasting regular, Honk (utqiagvik on Discord).</p>
              </div>
            </Card>
          </div>
        </Shell>
      </main>
    </>
  );
};

export default Home;
