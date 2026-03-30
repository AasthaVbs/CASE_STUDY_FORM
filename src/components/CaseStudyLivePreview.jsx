import React from "react"
import { buildCaseStudyDataFromValues } from "../utils/caseStudyData"

function asArray(v) {
  return Array.isArray(v) ? v : []
}

export function CaseStudyLivePreview({ values }) {
  const data = buildCaseStudyDataFromValues(values)
  const details = asArray(data.caseStudyDetails)
  const states = asArray(data.states)
  const features = asArray(data.features?.featureTile)
  const methodologySteps = asArray(data.workingMethodology?.steps)

  return (
    <div className="preview-card case-study-page case-preview-scope" style={{ padding: 0, overflow: "hidden" }}>
      <div className="preview-header">Live preview (caseStudy1 style)</div>

      <section
        className="pt-10 case-study-banner-section case-custom-hero"
        style={{
          backgroundImage: data.bannerImage ? `url(${data.bannerImage})` : undefined,
          backgroundPosition: data?.customStoryLayout?.heroBgPosition || "center",
          backgroundSize: data?.customStoryLayout?.heroBgSize || "cover",
          backgroundRepeat: data?.customStoryLayout?.heroBgRepeat || "no-repeat",
          minHeight: 220,
          padding: "2rem",
        }}
      >
        <h1 className="case-custom-hero-title">{data.bannerTitle || data.title || "Case Study Title"}</h1>
      </section>

      <section className="case-custom-content-section" style={{ padding: "1rem 1.25rem 1.5rem" }}>
        <p className="date">{data.description || "Description..."}</p>
        {data.description2 ? <p className="date mb-2">{data.description2}</p> : null}

        {details.length > 0 ? (
          <div className="case-custom-meta-wrap case-custom-meta-inline case-custom-meta-wrap--stats-highlight">
            {details.slice(0, 4).map((detail, idx) => (
              <div key={idx} className="case-custom-meta-item">
                <p className="case-custom-meta-title">{detail.typeTitle || "Meta"}</p>
                <h6 className="case-custom-meta-value">{detail.description || "-"}</h6>
              </div>
            ))}
          </div>
        ) : null}

        {states.map((state, idx) => (
          <div key={idx} style={{ marginTop: 24 }}>
            <h3 className="fs-1 mb-4 text-primary case-custom-section-title">{state.title || "Section"}</h3>
            <div className="list-style-2 case-custom-list">
              <ul>
                {asArray(state.points).map((point, pidx) => (
                  <li key={pidx}>
                    <div dangerouslySetInnerHTML={{ __html: point || "" }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {data?.customStoryLayout?.postExecution?.title ? (
          <div style={{ marginTop: 24 }}>
            <h3 className="case-custom-impact-title case-custom-impact-title-top mb-0">
              {data.customStoryLayout.postExecution.title}
            </h3>
            <div className="list-style-2 case-custom-list case-custom-impact-list mb-4">
              <ul>
                {asArray(data.customStoryLayout.postExecution.points).map((item, idx) => (
                  <li key={idx}>
                    <span className="case-custom-impact-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {data?.workingMethodology?.title ? (
          <div style={{ marginTop: 24 }}>
            <h2 className="mb-0">{data.workingMethodology.title}</h2>
            {data.workingMethodology.description ? <p className="date mt-3 mb-0">{data.workingMethodology.description}</p> : null}
            {methodologySteps.length > 0 ? (
              <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                {methodologySteps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {data?.features?.featuresTitle ? (
          <div style={{ marginTop: 24 }}>
            <h2 className="mb-2">{data.features.featuresTitle}</h2>
            <div className="case-custom-tools-features-row" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
              {features.map((feature, idx) => (
                <div key={idx} className={`text-center h-100 p-5 ${feature.type === "primary" ? "bg-primary bg-opacity-10" : "bg-light"}`}>
                  <h4 className="mb-0 text-dark">{feature.title || "Tool"}</h4>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

