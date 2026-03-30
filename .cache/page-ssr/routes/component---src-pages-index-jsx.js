"use strict";
exports.id = 279;
exports.ids = [279];
exports.modules = {

/***/ 1744:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ Seo)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3774);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8154);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(123);
function Seo({title,description}){const data=(0,gatsby__WEBPACK_IMPORTED_MODULE_2__.useStaticQuery)("1879012341");const siteTitle=data.site.siteMetadata.title;const defaultDesc=data.site.siteMetadata.description;const pageTitle=title?`${title} · ${siteTitle}`:siteTitle;return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_helmet__WEBPACK_IMPORTED_MODULE_1__.Helmet,{defaultTitle:siteTitle,titleTemplate:`%s · ${siteTitle}`},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("title",null,pageTitle),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta",{name:"description",content:description||defaultDesc}),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("html",{lang:"en"}));}

/***/ }),

/***/ 4733:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ Layout)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3774);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(123);
function Layout({title,children}){return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div",{className:"shell"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("header",{className:"topbar"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{to:"/",className:"brand"},"Form CRM"),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("nav",{className:"nav"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{to:"/form/demo-case-study"},"User form (demo)"),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{to:"/admin"},"Admin"))),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("main",{className:"main"},title?/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1",{className:"page-title"},title):null,children));}

/***/ }),

/***/ 7325:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HomePage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3774);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(123);
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4733);
/* harmony import */ var _components_Seo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1744);
function HomePage(){return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Layout__WEBPACK_IMPORTED_MODULE_2__/* .Layout */ .P,{title:"Case study form CRM"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Seo__WEBPACK_IMPORTED_MODULE_3__/* .Seo */ .G,{title:"Home"}),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p",{className:"muted",style:{maxWidth:640}},"Dynamic React forms with a live preview, saved submissions via a small API, and an admin screen to export a standalone ",/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("code",null,".js")," component file that uses your shared UI primitives."),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div",{className:"stack",style:{marginTop:24}},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div",{className:"panel"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2",{style:{marginTop:0}},"User"),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p",{className:"muted"},"Fill a form and see the preview update as you type. Saves draft to the server (submission id is remembered in the browser)."),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{className:"btn btn-primary",style:{display:"inline-block"},to:"/form/demo-case-study"},"Open demo form")),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div",{className:"panel"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2",{style:{marginTop:0}},"Admin"),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p",{className:"muted"},"Create or edit form definitions, list submissions, and download generated component code."),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link,{className:"btn btn-primary",style:{display:"inline-block"},to:"/admin"},"Open admin"))));}

/***/ })

};
;
//# sourceMappingURL=component---src-pages-index-jsx.js.map