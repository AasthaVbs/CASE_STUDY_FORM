import React, { useEffect, useState } from "react";
import { Container, Col, Row, Image, Modal, Button, Form } from "react-bootstrap";
import Header from "../components/Header";
import HeaderContactOnly from "../components/HeaderContactOnly";
import Footer from "../components/footer";
import Contact from "../components/contact";

import { navigate } from "gatsby";
import { useFormik } from 'formik';
import * as yup from "yup";
import axios from 'axios';
import emailjs from '@emailjs/browser';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import InputImage1 from "../../static/image/input1.jpg";
import InputImage2 from "../../static/image/input2.jpg";
import OutputImage1 from "../../static/image/output1.jpg";
import OutputImage2 from "../../static/image/output2.jpg";
// import { Link } from "gatsby";

const CaseStudyComponent = ({ data, page = "Contact_Form_Inquiry" }) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const formUrl = typeof window !== 'undefined' ? window.location.href : null;

  const [curCountry, setCountry] = useState();
  const [curCity, setCity] = useState();
  const [successMsg, setSuccessMsg] = useState("");
  // successMsg,
  const [disable, setDisable] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activePreviewMode, setActivePreviewMode] = useState(null);


  useEffect(() => {
    axios.get('https://ipinfo.io/json').then((result) => {
      setCountry(result.data['country']);
      setCity(result.data['city']);
    })

  }, []);

  const validationSchema = yup.object().shape({
    full_name: yup.string().required('Name is required').matches(/^[aA-zZ\s]+$/, "Name is invalid"),
    email: yup.string().required('Business Email is required').email('Business Email is invalid'),
    mobile_number: yup.string().required("Mobile Number is required").min(4, "Mobile number is invalid"),
    // company_name: yup.string().matches('Company name is required').matches(/^[aA-zZ\s]+$/, "Name is invalid"),
    looking_for: yup.string().required('This field is required'),
    message: yup.string().required('Message is required')

  });


  const formikLogin = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      mobile_number: "",
      looking_for: "",
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setDisable(true);
      setIsLoading(true);

      const formValues = {
        ...values,
        Source: formUrl,
        city: curCity,
        country: curCountry,
        page: page,
      };

      try {
        await Promise.all([
          sendToZoho(formValues),
          sendToEmailJS(formValues)
        ]);
        setSuccessMsg("Your message has been sent successfully");
        resetForm();
        navigate("/thank-you");
      } catch (error) {
        setSuccessMsg("Some error occurred");
      } finally {
        setDisable(false);
        setIsLoading(false);
      }
    },
  });

  const sendToZoho = async formValues => {
    try {
      const response = await fetch("/api/zoho", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.message;
      } else {
        console.error("Zoho request failed");
        throw new Error("Zoho request failed");
      }
    } catch (error) {
      console.error("Failed to make Zoho request", error);
      throw error;
    }
  };

  const sendToEmailJS = formValues => {
    return emailjs.send(process.env.SERVICE_ID, process.env.TEMPLATE_ID, formValues, process.env.PUBLIC_KEY);
  };

  const { errors, touched } = formikLogin;

  const caseStudyPdfUrl =
  data?.customStoryLayout?.caseStudyPdfUrl || data?.caseStudyPdfUrl || "";


  const isCustomHero = Boolean(data?.customStoryLayout?.useCustomHero);
  const useDefaultHeader = Boolean(data?.customStoryLayout?.useDefaultHeader);
  const useContactHeaderOnly = Boolean(data?.customStoryLayout?.useContactHeaderOnly);
  const centerIntroMetaBelow = Boolean(data?.customStoryLayout?.centerIntroMetaBelow);

  const pe = data?.customStoryLayout?.postExecution
  const inputFromForm = Array.isArray(pe?.inputImages) ? pe.inputImages.filter(Boolean) : []
  const outputFromForm = Array.isArray(pe?.outputImages) ? pe.outputImages.filter(Boolean) : []
  const sliderFallback = Array.isArray(data?.imageSlider?.images) ? data.imageSlider.images.filter(Boolean) : []
  const previewImageSets = {
    input:
      inputFromForm.length > 0
        ? inputFromForm
        : sliderFallback.length > 0
          ? sliderFallback
          : [InputImage1, InputImage2],
    output: outputFromForm.length > 0 ? outputFromForm : [OutputImage1, OutputImage2],
  };
  const handlePreviewButtonClick = mode => {
    setActivePreviewMode(mode);
  };
  const closePreviewOverlay = () => {
    setActivePreviewMode(null);
  };

  const introMetaDetailCount =
    typeof data?.customStoryLayout?.introMetaDetailCount === "number"
      ? data.customStoryLayout.introMetaDetailCount
      : 2;
  const metaStatsHighlight = Boolean(data?.customStoryLayout?.metaStatsHighlight);
  const introMetaWrapClass = `case-custom-meta-wrap case-custom-meta-inline${
    metaStatsHighlight ? " case-custom-meta-wrap--stats-highlight" : ""
  }`;
  const getMetaIconClass = title => {
    const normalized = (title || "").toLowerCase();
    if (normalized.includes("location")) return "fas fa-map-marker-alt";
    if (normalized.includes("level") || normalized.includes("lod")) return "fas fa-drafting-compass";
    if (normalized.includes("area")) return "fas fa-ruler-combined";
    return "fas fa-info-circle";
  };

  const renderPointContent = point => {
    if (point && typeof point === "object") {
      const pointTitle = point.title ? `${point.title}:` : "";
      return (
        <>
          {pointTitle ? <strong>{pointTitle} </strong> : null}
          {point.text || ""}
        </>
      );
    }
    return <>{point}</>;
  };

  const renderStateDescription = description => {
    if (!description) return null;

    if (typeof description === "string") {
      return <div dangerouslySetInnerHTML={{ __html: description }} />;
    }

    if (description && Array.isArray(description.sections)) {
      return (
        <div>
          {description.sections.map((section, sectionIndex) => (
            <div key={`section-${sectionIndex}`} className={sectionIndex > 0 ? "mt-4" : ""}>
              {section.title ? (
                <p className="date mb-lg-3">
                  <strong>{section.title}</strong>
                </p>
              ) : null}
              {section.text ? <p className="date mb-0">{section.text}</p> : null}
              {Array.isArray(section.points) &&
                section.points.map((sectionPoint, pointIndex) => (
                  <p
                    key={`section-point-${sectionIndex}-${pointIndex}`}
                    className={`date ${pointIndex === section.points.length - 1 ? "mb-0" : "mb-1"}`}
                  >
                    {sectionPoint?.title ? <strong>{sectionPoint.title}: </strong> : null}
                    {sectionPoint?.text || ""}
                  </p>
                ))}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className={`case-study-page ${data?.customStoryLayout?.pageClass || ""}`}>
      <style>{`
          .case-study-page .call-icon { display: none !important; }
        `}</style>
        {useContactHeaderOnly ? (
          <div className="case-contact-only-header">
            <HeaderContactOnly />
          </div>
        ) : useDefaultHeader ? (
          <Header />
        ) : (
          <div className="light-header">
            <Header />
          </div>
        )}
        {data.bannerImageMobile && (
          <>
            <style>{`
              @media (max-width: 575.98px) {
                .case-study-banner-section {
                  display: none !important;
                }
              }
            `}</style>
            <img
              src={data.bannerImageMobile}
              alt=""
              className="d-block d-sm-none w-100 case-study-banner-mobile-img"
              style={{ objectFit: "contain", height: "auto" }}
            />
          </>
        )}
        <section
          className={` pt-10 case-study-banner-section ${data.bannerImageMobile ? "d-none d-sm-flex" : ""} ${isCustomHero ? "case-custom-hero" : ""}`}
          style={{
            backgroundImage: `url(${data.bannerImage})`,
            backgroundPosition: data?.customStoryLayout?.heroBgPosition || "center center",
            backgroundSize: data?.customStoryLayout?.heroBgSize || "contain",
            backgroundRepeat: data?.customStoryLayout?.heroBgRepeat || "no-repeat",
            marginTop: isCustomHero ? "0rem" : undefined,
            paddingTop: isCustomHero ? "0" : undefined,
          }}
        >
          <Container>
            {data.bannerTitle ? (
              isCustomHero ? (
                <Row className="justify-content-start">
                  <Col lg={7} md={9} xs={12} className="blog-banner case-custom-hero-content">
                    <h1 className=" case-custom-hero-title">{data.bannerTitle}</h1>
                  </Col>
                </Row>
              ) : (
                <Col lg={8} xs={12} className="blog-banner text-center mx-auto">
                  <h1 className="case-custom-hero-title">{data.bannerTitle}</h1>
                </Col>
              )
            ) : null}
          </Container>
        </section>

        {caseStudyPdfUrl ? (
          <div className="success-stories-btn">
            <a
              href={caseStudyPdfUrl}
              className="pdf-fab case-study-pdf-fab"
              title="Download PDF"
              aria-label="Download PDF"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-file-pdf" aria-hidden="true" />
            </a>
            <style>{`
                .case-study-page .case-study-pdf-fab {
                  position: fixed;
                  right: 0;
                  top: 50%;
                  transform: translateY(-50%);
                  z-index: 9999;
                  background: #D70416;
                  color: #fff;
                  width: 56px;
                  height: 56px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 6px 18px rgba(215, 4, 22, 0.35);
                  text-decoration: none;
                }
                .case-study-page .case-study-pdf-fab .fa-file-pdf { font-size: 22px; }
                .case-study-page .case-study-pdf-fab:hover::after {
                  content: 'Download PDF';
                  position: absolute;
                  right: 0;
                  top: 50%;
                  transform: translateY(-50%);
                  background: #111;
                  color: #fff;
                  padding: 6px 10px;
                  border-radius: 6px;
                  white-space: nowrap;
                  font-size: 12px;
                }
              `}</style>
          </div>
        ) : null}


        <section className={`${data?.customStoryLayout ? "case-custom-content-section" : ""}`}>
          <Container>
            {data?.customStoryLayout ? (
              <>
                <Row lg={2} xs={1} className="g-5 mt-1 mb-4 align-items-center case-custom-intro-row">
                  <Col lg={6}>
                    <div className="sticky-section">
                      <p className="date">{data.description}</p>
                      <p className="date mb-2">{data.description2}</p>
                      {!centerIntroMetaBelow && Array.isArray(data.caseStudyDetails) && data.caseStudyDetails.length > 0 && (
                        <div className="case-custom-meta-wrap case-custom-meta-inline">
                          {data.caseStudyDetails.slice(0, 2).map((detail, index) => (
                            <div key={`${detail.typeTitle}-${index}`} className="case-custom-meta-item">
                              <span className="case-custom-meta-icon-wrap">
                                <i className={getMetaIconClass(detail.typeTitle)} aria-hidden="true"></i>
                              </span>
                              <p className="case-custom-meta-title">{detail.typeTitle}</p>
                              <h6 className="case-custom-meta-value">{detail.description}</h6>
                             
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={6}>
                    <Image
                      src={data.customStoryLayout?.introImage}
                      className="img-fluid  case-custom-media"
                      alt="Case study introduction"
                    />
                  </Col>
                </Row>

                {data?.customStoryLayout && centerIntroMetaBelow && Array.isArray(data.caseStudyDetails) && (
            <div className="case-custom-meta-below-wrap">
              <div className={`${introMetaWrapClass} case-custom-meta-below`}>
                {data.caseStudyDetails.slice(0, introMetaDetailCount).map((detail, index) => (
                  <div key={`${detail.typeTitle}-below-${index}`} className="case-custom-meta-item">
                    <span className="case-custom-meta-icon-wrap">
                      <i className={getMetaIconClass(detail.typeTitle)} aria-hidden="true"></i>
                    </span>
                    <p className="case-custom-meta-title">{detail.typeTitle}</p>
                    <h6 className="case-custom-meta-value">{detail.description}</h6>
                    {detail.metaLabel && (
                      <p className="case-custom-meta-caption">
                        <span className="case-custom-meta-caption-dot" />
                        {detail.metaLabel}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

                <Row lg={2} xs={1} className="g-5 my-9 align-items-center case-custom-pain-row">
                  <Col lg={6}>
                    <h3 className="fs-1 mb-4 text-primary case-custom-section-title">{data.customStoryLayout?.painPointsTitle}</h3>
                    <div className="list-style-2 case-custom-list">
                      <ul>
                        {data.customStoryLayout?.painPoints?.map((point, index) => (
                          <li key={index}>
                            <div>{renderPointContent(point)}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <Image
                      src={data.customStoryLayout?.painPointsImage}
                      className="img-fluid rounded-4 case-custom-media"
                      alt="Pain points"
                    />
                  </Col>
                </Row>

                <Row lg={2} xs={1} className="g-5 mb-9 align-items-center case-custom-solution-row">
                  <Col lg={6}>
                    <Image
                      src={data.customStoryLayout?.solutionsImage}
                      className="img-fluid rounded-4 case-custom-media"
                      alt="Solutions"
                    />
                  </Col>
                  <Col lg={6}>
                    <h3 className="fs-1 mb-4 text-primary case-custom-section-title">{data.customStoryLayout?.solutionsTitle}</h3>
                    <div className="list-style-2 case-custom-list">
                      <ul>
                        {data.customStoryLayout?.solutions?.map((point, index) => (
                          <li key={index}>
                            <div>{renderPointContent(point)}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row lg={2} xs={1} className="g-5 mb-9">
                  <Col lg={4}>
                    <div className="sticky-section">
                      <p className="date">{data.description}</p>
                      <p className="date mb-0">{data.description2}</p>
                    </div>
                  </Col>
                  <Col lg={8}>
                    {data.caseStudyDetails.map((detail, index) => (
                      <div key={index} className={`mb-1 p-3 d-flex align-items-center ${detail.type === "primary" ? "bg-primary bg-opacity-10" : "bg-light"}`}>
                        <Image src={detail.icon} className="me-4" width={56} height={56} />
                        <div>
                          <p className="mb-1">{detail.typeTitle} </p>
                          <h5 className="mb-0 text-dark">{detail.description}</h5>
                        </div>
                      </div>
                    ))}
                  </Col>
                </Row>
                {data.states.map((state, index) => (
                  <Row key={index} lg={2} xs={1} className="g-5 mb-9">
                    <Col lg={4}>
                      <div className="sticky-section">
                        <h3 className="fs-1 mb-2 text-primary">{state.title}</h3>
                        <Image src={state.image} width={360} height={300} className="img-fluid" />
                      </div>
                    </Col>
                    <Col lg={8}>
                      <div className="list-style-2">
                        <ul>
                          {state.points.map((point, index) => (
                            <li key={index}>
                              <div>{renderPointContent(point)}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {renderStateDescription(state.description)}
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Container>
        
        </section>

        {/* <section className="py-10">
            <Container>
              <Col lg={9} xs={12} className="mx-auto">
                <div className="casestudy-cta m-0 text-center">
                  <div className="title mb-3">{data.cta.title}</div>
                  <div>
                    <Link className="btn btn-light" to="/contact-us/">{data.cta.btn}<i className="icon ms-1 fa fa-lg fa-long-arrow-alt-right"></i></Link>
                  </div>
                </div>
              </Col>
            </Container>
          </section> */}
        {/* {data.teamStructure &&
        <section className="py-10">
          <Col lg={8} xs={12} className="text-center mx-auto mb-5">
            <h2 className="mb-0">{data.teamStructure.title}</h2>
          </Col>
          <Container>
            <Image src={data.teamStructure.teamStructureImage} width={1200} height={621} className="img-fluid text-center" />
          </Container>
        </section>
      } */}
        {/* <section className="py-10 bg-primary bg-opacity-10">
          <Container>
            <Col lg={8} xs={12} className="text-center mx-auto mb-5">
              <h2 className="mb-0">
                <div dangerouslySetInnerHTML={{ __html: data.tableSection.title }} />
              </h2>
            </Col>
            <div className="text-center">
              <Image src={data.tableSection.tableImage} width={835} className="img-fluid" />
            </div>
          </Container>
        </section> */}
        {data.workingMethodology &&
          <section className="py-10">
            <Col lg={8} xs={12} className="text-center mx-auto mb-5">
              <h2 className="mb-0">
                <div dangerouslySetInnerHTML={{ __html: data.workingMethodology.title, }} />
              </h2>
              {data.workingMethodology.description && (
                <p className="date mt-3 mb-0">{data.workingMethodology.description}</p>
              )}
              {/* {Array.isArray(data.workingMethodology.steps) && data.workingMethodology.steps.length > 0 && (
              <div className="mt-4">
                <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3 mb-0">
                  {data.workingMethodology.steps.map((step, index) => (
                    <li
                      key={`${step}-${index}`}
                      className="px-3 py-2 bg-light rounded-pill border"
                    >
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
            </Col>
            <Container>
              <Image src={data.workingMethodology.workingMethodologyImage} width={1200} height={450} className="img-fluid text-center" />
            </Container>
          </section>
        }
        {data?.customStoryLayout?.postExecution && (
          <>
            <section className="py-10">
              <Container className="px-0">
                <div className="case-custom-io-block">
                  <div className="case-custom-io-main-image-wrap">
                    <Image
                      src={data.customStoryLayout.postExecution.image}
                      width={1200}
                      className="img-fluid text-center"
                      alt="Input and output overview"
                    />
                  </div>
                  <div className="case-custom-io-button-grid">
                    <div
                      className="case-custom-io-side case-custom-io-card"
                    >
                      {/* <h4 className="case-custom-io-card-title">The Input Drawings We Got</h4> */}
                      <div className="case-custom-io-thumb-grid">
                        {previewImageSets.input.map((imgSrc, idx) => (
                          <Image
                            key={`input-thumb-${idx}`}
                            src={imgSrc}
                            className="case-custom-io-thumb-image"
                            alt={`Project input example ${idx + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn case-custom-io-button case-custom-io-button-pill"
                        onClick={() => handlePreviewButtonClick("input")}
                      >
                        <i className="far fa-eye me-2" aria-hidden="true"></i>
                        View Inputs
                      </button>
                    </div>
                    <div
                      className="case-custom-io-side case-custom-io-card"
                    >
                      {/* <h4 className="case-custom-io-card-title">The Output Drawings We Gave</h4> */}
                      <div className="case-custom-io-thumb-grid">
                        {previewImageSets.output.map((imgSrc, idx) => (
                          <Image
                            key={`output-thumb-${idx}`}
                            src={imgSrc}
                            className="case-custom-io-thumb-image"
                            alt={`Project output example ${idx + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn case-custom-io-button case-custom-io-button-pill"
                        onClick={() => handlePreviewButtonClick("output")}
                      >
                        <i className="far fa-eye me-2" aria-hidden="true"></i>
                        View Outputs
                      </button>
                    </div>
                  </div>
                </div>
              </Container>
            </section>
            {activePreviewMode && (
              <div
                className="case-custom-io-overlay"
                role="dialog"
                aria-modal="true"
                onClick={closePreviewOverlay}
              >
                <div className="case-custom-io-overlay-inner" onClick={e => e.stopPropagation()}>
                  <button
                    type="button"
                    className="case-custom-io-overlay-close"
                    onClick={closePreviewOverlay}
                    aria-label="Close preview"
                  >
                    <i className="fas fa-times" aria-hidden="true"></i>
                  </button>
                  <h4 className="case-custom-io-overlay-title">
                    {activePreviewMode === "input" ? "The Input Drawings We Got" : "The Output Drawings We Gave"}
                  </h4>
                  <div className="case-custom-io-overlay-grid">
                    {previewImageSets[activePreviewMode].map((imgSrc, idx) => (
                      <Image
                        key={`${activePreviewMode}-overlay-${idx}`}
                        src={imgSrc}
                        className="case-custom-io-overlay-image"
                        alt={`${activePreviewMode} preview ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <section className="pt-5">
              <Container>
                <Col lg={12} xs={12} className="text-center mb-5">
                  <h3 className="case-custom-impact-title case-custom-impact-title-top mb-0">
                    {data.customStoryLayout.postExecution.title}
                  </h3>
                </Col>
                <Row lg={2} xs={1} className="g-5 align-items-center case-custom-impact-row">
                  <Col lg={7}>
                    <div className="case-custom-impact-card">
                      {/* <p className="case-custom-impact-kicker mb-2">Project Deliverables</p> */}
                      <div className="list-style-2 case-custom-list case-custom-impact-list mb-4">
                        <ul>
                          {data.customStoryLayout.postExecution.points?.map((item, index) => (
                            <li key={index}>
                              <span className="case-custom-impact-text">{renderPointContent(item)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col lg={5}>
                    <div className="case-custom-impact-media-wrap">
                      <Image
                        src={data.customStoryLayout.postExecution.sideImage}
                        className="img-fluid rounded-4 case-custom-media case-custom-impact-media"
                        alt="Key advantage"
                      />
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <button type="button" className="btn btn-danger case-custom-impact-btn text-uppercase">
                    Start your project
                  </button>
                </div>
              </Container>
            </section>
          </>
        )}
        {Array.isArray(data?.features?.featureTile) && data.features.featureTile.length > 0 && (
          <section className="py-10">
            <Col lg={6} xs={12} className="text-center mx-auto mb-5 mt-4">
              <h2 className="mb-0">
                <div dangerouslySetInnerHTML={{ __html: data?.features?.featuresTitle || "Tools Used" }} />
              </h2>
            </Col>
            <Container className="pb-5">
              <Row
                lg={3}
                md={2}
                xs={data?.customStoryLayout?.pageClass === "singapore-case-theme" ? 3 : 1}
                className="g-6 justify-content-center case-custom-tools-features-row"
              >
                {data.features.featureTile.map((feature, index) => (
                  <Col key={index}>
                    <div className={`text-center h-100 p-5 ${feature.type === "primary" ? "bg-primary bg-opacity-10" : "bg-light"}`}>
                      {feature.icon ? (
                        <Image src={feature.icon} width={56} height={56} className="mb-2" alt="" />
                      ) : null}
                      <h4 className="mb-0 text-dark">{feature.title}</h4>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        )}
        <Contact />
        <Footer />
      </div>
    </>
  );
};

export default CaseStudyComponent;
