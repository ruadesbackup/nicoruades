import SeoHead from '../../../shared/seo/SeoHead'
import aboutSeoImg from '../../../assets/perfil/NicolasRuades.jpg'
import nicolasRuadesImg from '../../../assets/perfil/NicolasRuades.jpg'
import yaninaCardozoImg from '../../../assets/perfil/YaninaCardozo.jpg'
import juanCenturionImg from '../../../assets/perfil/JuanCenturion.jpg'
import danielaMarquezImg from '../../../assets/perfil/DanielaMarquez.jpg'
import './AboutPage.css'

const LAWYERS = [
  {
    id: 'nicolas-ruades',
    name: 'Nicolas Ruades',
    role: 'Abogado Penalista',
    image: nicolasRuadesImg,
    imageAlt: 'Retrato de Nicolas Ruades, abogado penalista',
    description:
      'Lidera el estudio con foco en estrategia penal, defensa tecnica y acompanamiento constante en cada etapa del proceso judicial.',
  },
  {
    id: 'yanina-cardozo',
    name: 'Yanina del Milagro Cardozo',
    role: 'Abogada Asociada',
    image: yaninaCardozoImg,
    imageAlt: 'Retrato de Yanina del Milagro Cardozo, abogada asociada',
    description:
      'Aporta una mirada integral del caso, con trabajo coordinado en investigacion, preparacion de audiencias y seguimiento de clientes.',
  },
  {
    id: 'juan-centurion',
    name: 'Juan Domingo Centurion',
    role: 'Abogado Asociado',
    image: juanCenturionImg,
    imageAlt: 'Retrato de Juan Domingo Centurion, abogado asociado',
    description:
      'Especializado en analisis probatorio y construccion de argumentos defensivos claros, solidos y orientados a resultados.',
  },
  {
    id: 'daniela-marquez',
    name: 'Daniela Marquez Villaseca',
    role: 'Abogada Asociada',
    image: danielaMarquezImg,
    imageAlt: 'Retrato de Daniela Marquez Villaseca, abogada asociada',
    description:
      'Trabaja en el acompanamiento personalizado de cada consulta, priorizando claridad juridica, contencion y resolucion eficiente.',
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
        image={aboutSeoImg}
        jsonLd={legalServiceJsonLd}
      />

      <section className="about-hero" aria-labelledby="about-title">
        <p className="about-kicker">Estudio Juridico</p>
        <h1 id="about-title">Nosotros</h1>
        <p className="about-lead">
          Somos un equipo legal orientado a la defensa estrategica, la cercania con cada cliente y la construccion de soluciones juridicas claras.
        </p>
      </section>

      <section className="about-team" aria-label="Equipo de abogados">
        {LAWYERS.map((lawyer) => (
          <article key={lawyer.id} className="lawyer-card">
            <img src={lawyer.image} alt={lawyer.imageAlt} className="lawyer-photo" loading="lazy" />

            <div className="lawyer-content">
              <h2>{lawyer.name}</h2>
              <p className="lawyer-role">{lawyer.role}</p>
              <p>{lawyer.description}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default AboutPage
