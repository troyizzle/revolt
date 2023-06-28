type AdminFormLayoutProps = {
  title: string
  children: React.ReactNode
  error?: string | null
}

export default function AdminFormLayout({ title, children, error }: AdminFormLayoutProps) {
  return (
    <div className="flex flex-col gap-3 m-2">
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <hr />
      {error &&
        <div className="alert alert-error">
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 4v16m8-8H4" />
            </svg>
            <label>{error}</label>
          </div>
        </div>
      }
      {children}
    </div>
  )
}
