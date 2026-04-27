import './LawyerCard.css'

function LawyerCard({ image, imageAlt, name, role, description }) {
  return (
    <article className="lawyer-card">
      <img src={image} alt={imageAlt} className="lawyer-photo" loading="lazy" />
      <div className="lawyer-content">
        <h3 className="lawyer-name">{name}</h3>
        <p className="lawyer-role">{role}</p>
        <p className="lawyer-desc">{description}</p>
      </div>
    </article>
  )
}

export default LawyerCard