// An image served as WebP at the sizes in `widths` (`<name>-<w>.webp` next to the original in
// public/images/), with the original JPEG/PNG as the fallback. Without `widths` (an event picture
// from an https URL, an avatar that is already small) it renders a plain <img>. Extra props go
// to the <img>. Making the files: CONTRIBUTING.md → Images.
export default function Picture({ src, widths, sizes, ...imgProps }) {
  if (!widths) return <img src={src} {...imgProps} />
  const base = src.replace(/\.[^./]+$/, '')
  const srcSet = widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ')
  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img src={src} {...imgProps} />
    </picture>
  )
}
