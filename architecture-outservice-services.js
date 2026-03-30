import React from "react";
import Seo from "../../components/seo";
import { ArchitectureOutsourceServicesMeta } from "../../data/metaData";
import CaseStudyComponent from "../../components/caseStudy1";
import bannerImage from "../../../static/image/casestudy-banner.jpg";
import bannerImageMobile from "../../../static/image/casestudy-banner2.jpg";
import CasestudyIcon1 from "../../../static/image/Asset 1 2.svg";
import CasestudyIcon2 from "../../../static/image/Asset 3 1.svg";
import CasestudyIcon3 from "../../../static/image/Asset 2 1.svg";
import cureentstate from "../../../static/image/cureent-state.png";
import beforestate from "../../../static/image/before-state.png";
import SwiperImage1 from "../../../static/image/aecom-project-1.jpg";
import SwiperImage2 from "../../../static/image/aecom-project-2.jpg";
import TeamStructureImage from "../../../static/image/team-structure-aecom.png";
// import CasestudyCheck from "../../../static/icon/casestudy-check.png";
import WorkingMethodology from "../../../static/image/Execution Strategy 1.svg";
import TableImg from "../../../static/image/aecom-table-img.png";
import CaseStudyIntroImage from "../../../static/image/casestudy-intro.jpg";
import InputOutputImage from "../../../static/image/Input-Output 2.svg";
import CoordinatedImage from "../../../static/image/coordinated.jpg";

import RevitIcon from "../../../static/icon/revit.png";
import LumionIcon from "../../../static/icon/lumion.png";
import AutoCADIcon from "../../../static/icon/autocad.png";


export const Head = () => (
    <Seo
        pathname="/success-stories/architecture-outservice-services/"
        title={ArchitectureOutsourceServicesMeta.metaTitle}
        description={ArchitectureOutsourceServicesMeta.metaDescription}
        ogImage={ArchitectureOutsourceServicesMeta.ogImage}
        twitterImage={ArchitectureOutsourceServicesMeta.twitterImage}
    >
        <meta name="robots" content="noindex, follow" />
    </Seo>
);


const caseStudyData = {

    bannerImage: bannerImage,
    bannerImageMobile: bannerImageMobile,
    caseStudyPdfUrl: "https://www.virtualbuildingstudio.com/resources/your-case-study.pdf",
    // bannerTitle: `From Redlines to Renders: Multi-Family Apartment, Las Vegas`,
    description:
        "A Las Vegas-based architectural design firm engaged our team to support documentation review and design visualization for a multi-family apartment development. The project was executed through a dedicated remote architect embedded within the client’s workflow, enabling fast iteration on documentation updates and facade visualization while maintaining continuous coordination. The result was a clean documentation set and a compelling visual package that enabled the client to move confidently into design approvals and next-stage development.",
    customStoryLayout: {
        useCustomHero: true,
        useDefaultHeader: true,
        useContactHeaderOnly: true,
        centerIntroMetaBelow: true,
        introMetaDetailCount: 3,
        metaStatsHighlight: true,
        pageClass: "singapore-case-theme",
        heroBgPosition: "center",
        heroBgSize: "contain",
        heroBgRepeat: "no-repeat",
        introImage: CaseStudyIntroImage,
        painPointsTitle: "Pain Points of The Client",
        painPointsImage: beforestate,
        solutionsTitle: "How We Solved It",
        solutionsImage: cureentstate,
        painPoints: [
            {
                title: "Drawing Discrepancies & Coordination Gaps",
                text: "Existing drawings had inconsistencies that needed correction before the project could progress.",
            },
            {
                title: "Design Decision Bottleneck",
                text: "Multiple facades and material options were needed, with no clear visual reference to start from.",
            },
            {
                title: "First-Time Documentation Involvement",
                text: "Fast onboarding and precise understanding of requirements were critical from day one.",
            },
            {
                title: "Dual-Purpose Output Needed",
                text: "Visuals had to serve both technical approvals and marketing needs simultaneously.",
            },
        ],
        solutions: [
            {
                title: "Structured Documentation Review",
                text: "Audited existing AutoCAD drawings against submission comments.",
            },
            {
                text: "Prepared consolidated RFI list and resolved conflicts before production.",
            },
            {
                title: "Systematic Mark-Up Resolution",
                text: "Incorporated all technical and graphical mark-ups into AutoCAD files.",
            },
            {
                text: "Ensured layer consistency and cross-document coordination.",
            },
            {
                title: "Multiple Facade Options, Iteratively Refined",
                text: "Built 3D facade models in Revit based on client references and U.S. standards.",
            },
            {
                text: "Explored material and massing options through iterative review cycles.",
            },
            {
                title: "High-Quality Renders for Dual Use",
                text: "Exported Revit models into Lumion for photorealistic rendering.",
            },
            {
                text: "Delivered exterior and interior render package for approvals and marketing.",
            },
        ],
        postExecution: {
            image: InputOutputImage,
            title: "Coordinated. Approved. Delivered.",
            points: [
                "Resolved cross-document discrepancies, delivering a fully coordinated, submission-ready drawing set.",
                "Developed multiple Revit-based facade alternatives with varied material and massing options, accelerating design decisions.",
                "Produced permit-standard and marketing-grade photorealistic exterior and interior renders.",
                "Finalized a construction-feasible facade design through structured workflow and iterative client review cycles.",
                "A complete RFI resolution log is maintained, ensuring full documentation accuracy before advancing to visualization.",
                "Enabled seamless progression from documentation through Revit modeling to final render delivery.",
            ],
            sideImage: CoordinatedImage,
        },
    },
    caseStudyDetails: [
        {
            icon: CasestudyIcon1,
            type: "primary",
            typeTitle: "Level of Development",
            description: "LOD 200",
        },
        {
            icon: CasestudyIcon2,
            type: "light",
            typeTitle: "Project Area",
            description: "225,624 Sq.Ft.",
        },
        {
            icon: CasestudyIcon3,
            type: "primary",
            typeTitle: "Location",
            description: "Las Vegas",
        },
        {
            icon: CasestudyIcon1,
            type: "light",
            typeTitle: "Tools Used",
            description: "Revit, Lumion, AutoCAD",
        },
    ],
    states: [
        {
            title: "Pain Points of The Client",
            image: beforestate,
            points: [
                {
                    title: "Drawing Discrepancies & Coordination Gaps",
                    text: "Existing drawings had inconsistencies that needed correction before the project could progress.",
                },
                {
                    title: "Design Decision Bottleneck",
                    text: "Multiple facades and material options were needed, with no clear visual reference to start from.",
                },
                {
                    title: "First-Time Documentation Involvement",
                    text: "Fast onboarding and precise understanding of requirements were critical from day one.",
                },
                {
                    title: "Dual-Purpose Output Needed",
                    text: "Visuals had to serve both technical approvals and marketing needs simultaneously.",
                },
            ],
            description: {
                sections: [
                    {
                        title: "Execution Strategy",
                        text: "The project progressed through a structured delivery workflow, beginning with documentation audit and RFI consolidation, followed by coordinated drawing updates, BIM facade development, and final visualization. This structured approach allowed the client’s internal team to review iterations quickly while maintaining design continuity.",
                    },
                ],
            },
        },
        {
            title: "How We Solved It",
            image: cureentstate,
            points: [
                {
                    title: "Structured Documentation Review",
                    text: "Audited existing AutoCAD drawings against submission comments and prepared a consolidated RFI list to resolve conflicts before production.",
                },
                {
                    title: "Systematic Mark-Up Resolution",
                    text: "Incorporated all technical and graphical mark-ups into AutoCAD files with layer consistency and cross-document coordination.",
                },
                {
                    title: "Multiple Facade Options, Iteratively Refined",
                    text: "Built 3D facade models in Revit based on client references and U.S. standards, then explored material and massing options through iterative review cycles.",
                },
                {
                    title: "High-Quality Renders for Dual Use",
                    text: "Exported Revit models into Lumion for photorealistic rendering and delivered exterior and interior render packages for approvals and marketing.",
                },
            ],
            description: {
                sections: [
                    {
                        title: "Execution Workflow",
                        text: "Documentation Review -> Query Resolution -> Drawing Updates -> 3D Building Modeling -> Material & Elevation Development -> Final Visualization",
                    },
                    {
                        title: "Input Vs Output",
                        points: [
                            {
                                title: "What We Received",
                                text: "Existing 2D AutoCAD drawing set, client submission comments & RFI inputs, technical & graphical mark-ups, design references & brief, and approved interior layouts & finish schedule.",
                            },
                            {
                                title: "What We Delivered",
                                text: "Coordinated and corrected AutoCAD drawing set, updated floor plans with resolved mark-ups, construction-feasible Revit facade models, multi-option material & massing studies, and photorealistic Lumion exterior and interior renders.",
                            },
                            {
                                title: "Final Deliverable",
                                text: "Permit, approval, and marketing-ready render package.",
                            },
                        ],
                    },
                ],
            },
        },
    ],
    imageSlider: {
        title: "Project Images",
        images: [
            SwiperImage1,
            SwiperImage2,
        ],
    },
    teamStructure: {
        title: "Input Vs Output",
        teamStructureImage: TeamStructureImage,
    },
    features: {
        featuresTitle: `Tools Used`,
        featureTile: [
            {
                icon: RevitIcon,
                type: "primary",
                title: "Revit",
            },
            {
                icon: LumionIcon,
                type: "light",
                title: "Lumion",
            },
            {
                icon: AutoCADIcon,
                type: "primary",
                title: "AutoCAD",
            },
        ],
    },
    workingMethodology: {
        title: `Execution Strategy`,
        description:
            "The project progressed through a structured delivery workflow. Beginning with documentation audit and RFI consolidation, followed by coordinated drawing updates, BIM facade development, and final visualization. This structured approach allowed the client’s internal team to review iterations quickly while maintaining design continuity.",
        steps: [
            "Documentation Review",
            "Query Resolution",
            "Drawing Updates",
            "3D Building Modeling",
            "Material & Elevation Development",
            "Final Visualization",
        ],
        workingMethodologyImage: WorkingMethodology,
    },
    tableSection: {
        title: `Coordinated. Approved. Delivered.`,
        tableImage: TableImg,
        // tableData: {
        //     dedicatedArchitects: {
        //         numberOfDedicatedResource: "1",
        //         hiringWorkforceUSA: "$8,000",
        //         hiringWorkforceVBS: "$2,200",
        //     },
        //     caseStudy: "AECOM",
        //     caseDedicatedArchitects: {
        //         numberOfDedicatedResource: "50",
        //         hiringWorkforceUSA: "$400,000",
        //         hiringWorkforceVBS: "$110,000",
        //     },
        //     efficiency: {
        //         numberOfDedicatedResource: "50",
        //         hiringWorkforceUSA: "1X",
        //         hiringWorkforceVBS: "4X",
        //     },
        //     costSavings: {
        //         numberOfDedicatedResource: "4 Times",
        //         hiringWorkforceUSA: "0",
        //         hiringWorkforceVBS: "$290,000",
        //     },
        //     staffHiringTime: {
        //         numberOfDedicatedResource: "-",
        //         hiringWorkforceUSA: "45-60 Days",
        //         hiringWorkforceVBS: "3 Days",
        //     },
        //     hrOnboardingCost: {
        //         numberOfDedicatedResource: "-",
        //         hiringWorkforceUSA: "$3,000",
        //         hiringWorkforceVBS: "$0",
        //     },
        //     attrition: {
        //         numberOfDedicatedResource: "-",
        //         hiringWorkforceUSA: "30%",
        //         hiringWorkforceVBS: "0%",
        //     },
        // },
    },
    cta: {
        title: "Facing similar documentation and visualization bottlenecks?",
        btn: "See how we can help",
    },
    description2:
        "Resolved cross-document discrepancies with a fully coordinated submission-ready set, developed Revit-based facade alternatives with iterative client reviews, and delivered photorealistic exterior and interior renders for both permit-stage approvals and marketing usage.",

};

const ArchitectureOutsourceServicesCaseStudy = () => {
    return <CaseStudyComponent data={caseStudyData} />;
};

export default ArchitectureOutsourceServicesCaseStudy;



