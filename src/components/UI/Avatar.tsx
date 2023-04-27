type AvatarProps = {
  src: string | null | undefined
}

export default function Avatar({ src }: AvatarProps) {
  const defaultSrc = "https://www.gravatar.com/avatar/000/?d=mp"

  return (
    <div className="avatar">
      <div className="mask mask-squircle w-12 h-12">
        <img src={src ? src : defaultSrc} />
      </div>
    </div>
  )
}
