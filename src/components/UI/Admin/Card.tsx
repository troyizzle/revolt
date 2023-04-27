import { ReactNode } from "react"

type AdminCardProps = {
  children: ReactNode
}

export default function AdminCard({ children }: AdminCardProps) {
  return (
    <div className="card card-compact bg-base-300 shadow-xl">
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}


type TitleProps = {
  title: string
  children?: ReactNode
}

AdminCard.Title = function({ title, children }: TitleProps) {
  return (
    <div className="flex items-center space-x-3 justify-between">
      <h1 className="card-title">{title}</h1>
      {children}
    </div>
  )
}

type BodyProps = {
  children: ReactNode
}

AdminCard.Body = function({ children }: BodyProps) {
  return (
    <>
      <div className="divider mt-2"></div>
      <div className="h-full w-full pb-6">
        {children}
      </div>
    </>
  )
}
