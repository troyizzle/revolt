export default function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        {children}
      </table>
    </div>
  )
}

AdminTable.Head = function({ children }: { children: React.ReactNode }) {
  return <thead>
    {children}
  </thead>
}

AdminTable.HeadRow = function({ children }: { children: React.ReactNode }) {
  return <tr>
    {children}
  </tr>
}

AdminTable.HeadCell = function({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2">
    {children}
  </th>
}

AdminTable.Body = function({ children }: { children: React.ReactNode }) {
  return <tbody>
    {children}
  </tbody>
}

AdminTable.Cell = function({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2">
    {children}
  </td>
}
