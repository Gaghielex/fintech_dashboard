import heroImg from '../../assets/hero.png'

export function IllustrationPlaceholder() {
  return (
    <section className="mb-8 overflow-hidden rounded-2xl" aria-label="Hero illustration">
      <img
        src={heroImg}
        alt="Gabriel and Ana in dino onesies celebrating their finances"
        className="w-full object-cover"
        draggable={false}
      />
    </section>
  )
}
