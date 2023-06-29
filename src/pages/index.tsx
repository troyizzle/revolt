import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
      src: "/images/RVCCoverlay.png",
    },
    {
      title: "Hero Iamge Two",
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
          src={heroImages[currentImage]?.src ?? "/images/RVCCoverlay.png"}
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
  return (
    <>
      <Head>
        <title>Revolt</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Hero />
        <Shell>
          <Header
            className="place-items-center text-center"
            title="Rev-Volt Endurance Championship Season 4: Total Standings"
            description="Revolt season is a community of people who love to play games together."
          />
          <div className="space-y-5">
            <Card className="w-full block md:flex mt-4 px-6 py-20">
              <div className="sm:w-full md:w-1/2 lg:w-3/4 grow">
                <h2 className="text-2xl font-medium">Live Streams</h2>
                <p className="py-6">This season is live broadcast striaght on <Link
                  className="text-blue-500 hover:text-blue-600"
                  target="_blank"
                  href="https://www.twitch.tv/revoltunited">twitch</Link> to millions on people and commentated by a revolt legend.</p>
                <p>If you would like to participate in this season please reach out to utqiagvik on Discord</p>
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
              <div className="">
                <Image
                  src="/images/revolt-stream.png"
                  alt="Revolt Stream"
                  width={500}
                  height={500}
                  className="object-cover"
                />
              </div>
            </Card>
          </div>
        </Shell>
      </main>
    </>
  );
};

export default Home;
