import SeoHead from '../../../shared/seo/SeoHead'
import groupImg from '../../../assets/perfil/GrupoEstudio.jpeg' // Cambia por tu imagen grupal
import LawyerCard from '../componets/LawyerCard'
import nicolasRuadesImg from '../../../assets/perfil/NicolasRuades.jpeg'
import yaninaCardozoImg from '../../../assets/perfil/YaninaCardozo.jpeg'
import danielaMarquezImg from '../../../assets/perfil/DanielaMarquez.jpg'
import danielaMoralesImg from '../../../assets/perfil/DanielaMorales12.jpg'
import azulSellaImg from '../../../assets/perfil/AzulSella1.jpeg'
import lautaroVergaraImg from '../../../assets/perfil/LautaroVergara.jpeg'
import './AboutPage.css'

const LAWYERS = [
  {
    id: 'nicolas-ruades',
    name: 'Nicolas Ruades',
    role: 'Abogado Penalista',
    image: nicolasRuadesImg,
    imageAlt: 'Retrato de Nicolas Ruades, abogado penalista',
    description:
      'Tel: 351 6157496 | Email: ab.ruades@gmail.com',
  },
   {
    id: 'daniela-morales-leanza',
    name: 'Daniela Morales Leanza',
    role: 'Abogada Asociada',
    image: danielaMoralesImg,
    imageAlt: 'Retrato de Daniela Morales Leanza, abogada asociada',
    description:
      'Tel: 351 7043998 | Email: moralesleanzadaniela@gmail.com',
  },
   {
    id: 'azul-sella',
    name: 'Azul Sella',
    role: 'Abogada Asociada',
    image: azulSellaImg,
    imageAlt: 'Retrato de Azul Sella, abogada asociada',
    description:
      'Tel. 351 7043025 | Email: dra.azulsella@gmail.com',
  },
  {
    id: 'yanina-cardozo',
    name: 'Yanina del Milagro Cardozo',
    role: 'Abogada Asociada',
    image: yaninaCardozoImg,
    imageAlt: 'Retrato de Yanina del Milagro Cardozo, abogada asociada',
    description:
      'Tel: 351 3171160 | Email: milagrosymc37@gmail.com',
  },
   {
    id: 'lautaro-vergara',
    name: 'Lautaro Vergara',
    role: 'Abogado Asociado',
    image: lautaroVergaraImg,
    imageAlt: 'Retrato de Lautaro Vergara, abogado asociado',
    description:
      ' Tel. 2994 27-0928 | Email: lauty_lr@hotmail.com',
  },
]

function AboutPage() {
  const legalServiceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Estudio Juridico Nicolas Ruades',
    areaServed: 'Argentina',
    description:
      'Equipo de abogados con practica en derecho penal y asesoramiento integral para personas y empresas.',
    employee: LAWYERS.map((lawyer) => ({
      '@type': 'Person',
      name: lawyer.name,
      jobTitle: lawyer.role,
      worksFor: {
        '@type': 'LegalService',
        name: 'Estudio Juridico Nicolas Ruades',
      },
    })),
  }

return (
    <main className="about-page">
      <SeoHead
        title="Nosotros | Estudio Juridico Nicolas Ruades"
        description="Conoce al equipo de abogados del Estudio Juridico Nicolas Ruades y su enfoque profesional en defensa penal y asesoramiento legal."
        canonicalPath="/nosotros"
        image={groupImg}
        jsonLd={legalServiceJsonLd}
      />

      <section className="about-hero-img" aria-label="Equipo de abogados">
        <img src={groupImg} alt="Equipo de abogados del Estudio Jurídico" className="about-group-photo" />
        <div className="about-hero-overlay">
          <h1 className="about-hero-title">Un equipo nacional de abogados experimentados</h1>
          <p className="about-hero-lead">
            Nuestro estudio está definido por la experiencia, la pasión y la determinación de nuestro equipo. Conocé a los profesionales que te acompañarán en cada etapa.
          </p>
        </div>
      </section>

      <section className="about-team-grid" aria-label="Abogados del estudio">
        {LAWYERS.map((lawyer) => (
          <LawyerCard key={lawyer.id} {...lawyer} />
        ))}
      </section>
    </main>
  )
}

export default AboutPage
