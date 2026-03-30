"use strict";
exports.id = 807;
exports.ids = [807];
exports.modules = {

/***/ 909:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ UserFormPage)
});

// EXTERNAL MODULE: external "C:\\Projects\\Websites\\CASE_STUDY_FORM\\node_modules\\react\\index.js"
var external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_ = __webpack_require__(3774);
var external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default = /*#__PURE__*/__webpack_require__.n(external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_);
// EXTERNAL MODULE: ./.cache/gatsby-browser-entry.js + 11 modules
var gatsby_browser_entry = __webpack_require__(123);
// EXTERNAL MODULE: ./node_modules/@gatsbyjs/reach-router/dist/index.modern.mjs
var index_modern = __webpack_require__(6462);
// EXTERNAL MODULE: ./src/components/Layout.jsx
var Layout = __webpack_require__(4733);
// EXTERNAL MODULE: ./src/components/Seo.jsx
var Seo = __webpack_require__(1744);
;// ./src/components/common/FormField.jsx
function FormField({label,htmlFor,children}){return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("div",{className:"form-field"},label?/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("label",{className:"form-label",htmlFor:htmlFor},label):null,children);}
;// ./src/components/common/TextInput.jsx
function TextInput({className=``,...props}){return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("input",Object.assign({className:`input ${className}`.trim()},props));}
;// ./src/components/common/TextArea.jsx
function TextArea({className=``,rows=4,...props}){return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("textarea",Object.assign({className:`input textarea ${className}`.trim(),rows:rows},props));}
;// ./src/components/common/SelectField.jsx
function SelectField({className=``,children,...props}){return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("select",Object.assign({className:`input select ${className}`.trim()},props),children);}
;// ./src/components/common/PrimaryButton.jsx
function PrimaryButton({className=``,type=`button`,...props}){return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("button",Object.assign({type:type,className:`btn btn-primary ${className}`.trim()},props));}
;// ./src/components/common/FormStack.jsx
function FormStack({children}){return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("div",{className:"form-stack"},children);}
;// ./src/components/common/index.js

;// ./src/utils/fieldKey.js
function fieldKey(field){const n=field.name||field.id;return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(n)?n:`field_${String(field.id).replace(/[^a-zA-Z0-9_]/g,`_`)}`;}function buildDefaultValues(schema){const fields=(schema===null||schema===void 0?void 0:schema.fields)||[];const o={};for(const f of fields){const key=fieldKey(f);if(f.type===`select`&&f.options&&f.options.length){o[key]=f.options[0].value;}else if(f.type===`checkbox`){o[key]=false;}else{o[key]=``;}}return o;}
;// ./src/components/DynamicForm.jsx
function DynamicForm({schema,values,onChange,onSubmit,submitLabel=`Save`,disabled=false}){const fields=(schema===null||schema===void 0?void 0:schema.fields)||[];const handleChange=(key,value)=>{onChange({...values,[key]:value});};return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("form",{onSubmit:e=>{e.preventDefault();if(!disabled&&typeof onSubmit===`function`)onSubmit(values);},noValidate:true},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(FormStack,null,fields.map(f=>{var _values$key3;const key=fieldKey(f);const label=f.label||key;const required=!!f.required;if(f.type===`textarea`){var _values$key;return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(FormField,{key:f.id||key,label:label,htmlFor:key},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(TextArea,{id:key,name:key,value:(_values$key=values[key])!==null&&_values$key!==void 0?_values$key:``,onChange:e=>handleChange(key,e.target.value),placeholder:f.placeholder||``,rows:f.rows&&f.rows>0?f.rows:4,required:required,disabled:disabled}));}if(f.type===`select`&&Array.isArray(f.options)){var _values$key2;return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(FormField,{key:f.id||key,label:label,htmlFor:key},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(SelectField,{id:key,name:key,value:(_values$key2=values[key])!==null&&_values$key2!==void 0?_values$key2:``,onChange:e=>handleChange(key,e.target.value),required:required,disabled:disabled},f.options.map(o=>/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("option",{key:o.value,value:o.value},o.label||o.value))));}if(f.type===`checkbox`){return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(FormField,{key:f.id||key,label:"",htmlFor:key},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("label",{className:"checkbox-row"},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("input",{type:"checkbox",id:key,name:key,checked:!!values[key],onChange:e=>handleChange(key,e.target.checked),disabled:disabled}),/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("span",null,label)));}const inputType=f.type===`email`?`email`:f.type===`number`?`number`:`text`;return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(FormField,{key:f.id||key,label:label,htmlFor:key},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(TextInput,{id:key,name:key,type:inputType,value:(_values$key3=values[key])!==null&&_values$key3!==void 0?_values$key3:``,onChange:e=>handleChange(key,e.target.value),placeholder:f.placeholder||``,required:required,disabled:disabled}));}),/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("div",null,/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(PrimaryButton,{type:"submit",disabled:disabled},submitLabel))));}
;// ./src/components/FormPreview.jsx
function formatValue(field,value){if(field.type===`checkbox`)return value?`Yes`:`No`;if(value===undefined||value===null||value===``)return`—`;return String(value);}function FormPreview({schema,values}){const fields=(schema===null||schema===void 0?void 0:schema.fields)||[];return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("div",{className:"preview-card"},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("div",{className:"preview-header"},"Live preview"),/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("dl",{className:"preview-dl"},fields.map(f=>{const key=fieldKey(f);const label=f.label||key;return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("div",{key:f.id||key,className:"preview-row"},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("dt",null,label),/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("dd",null,formatValue(f,values[key])));})));}
// EXTERNAL MODULE: ./src/utils/api.js
var api = __webpack_require__(9086);
;// ./src/pages/form/[slug].jsx
function storageKey(formId){return`crm_submission_${formId}`;}function UserFormPage({params:paramsProp}){var _paramsProp$slug;const reach=(0,index_modern.useParams)();const slug=(_paramsProp$slug=paramsProp===null||paramsProp===void 0?void 0:paramsProp.slug)!==null&&_paramsProp$slug!==void 0?_paramsProp$slug:reach===null||reach===void 0?void 0:reach.slug;const{0:form,1:setForm}=(0,external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_.useState)(null);const{0:values,1:setValues}=(0,external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_.useState)({});const{0:submissionId,1:setSubmissionId}=(0,external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_.useState)(null);const{0:loading,1:setLoading}=(0,external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_.useState)(true);const{0:saving,1:setSaving}=(0,external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_.useState)(false);const{0:message,1:setMessage}=(0,external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_.useState)(null);const{0:error,1:setError}=(0,external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_.useState)(null);(0,external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_.useEffect)(()=>{let cancelled=false;async function load(){setLoading(true);setError(null);try{const f=await (0,api/* apiJson */.T)(`/api/forms/by-slug/${encodeURIComponent(slug)}`);if(cancelled)return;setForm(f);const defaults=buildDefaultValues(f.schema);let sid=typeof window!==`undefined`?window.localStorage.getItem(storageKey(f.id)):null;if(sid){try{const sub=await (0,api/* apiJson */.T)(`/api/submissions/${encodeURIComponent(sid)}`);if(sub&&sub.formId===f.id){setSubmissionId(sub.id);setValues({...defaults,...sub.data});setLoading(false);return;}}catch{sid=null;}}setValues(defaults);setSubmissionId(null);}catch(e){if(!cancelled)setError(e.message||`Failed to load form`);}finally{if(!cancelled)setLoading(false);}}if(slug)load();return()=>{cancelled=true;};},[slug]);const onSave=(0,external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_.useCallback)(async()=>{if(!form)return;setSaving(true);setMessage(null);setError(null);try{if(submissionId){const sub=await (0,api/* apiJson */.T)(`/api/submissions/${encodeURIComponent(submissionId)}`,{method:`PUT`,body:JSON.stringify({data:values})});setMessage(`Saved.`);setValues({...values,...sub.data});}else{const sub=await (0,api/* apiJson */.T)(`/api/forms/${encodeURIComponent(form.id)}/submissions`,{method:`POST`,body:JSON.stringify({data:values})});setSubmissionId(sub.id);if(typeof window!==`undefined`){window.localStorage.setItem(storageKey(form.id),sub.id);}setMessage(`Saved. Your edits are linked on this browser.`);}}catch(e){setError(e.message||`Save failed`);}finally{setSaving(false);}},[form,submissionId,values]);const title=(0,external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_.useMemo)(()=>(form===null||form===void 0?void 0:form.title)||`Form`,[form]);if(!slug){return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(Layout/* Layout */.P,{title:"Form"},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("p",{className:"error"},"Missing form slug."));}return/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(Layout/* Layout */.P,{title:loading?`Loading…`:title},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(Seo/* Seo */.G,{title:title,description:form===null||form===void 0?void 0:form.description}),/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("p",{className:"muted"},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(gatsby_browser_entry.Link,{to:"/"},"Home"),form?/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement((external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default()).Fragment,null," ","\xB7 ",/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("span",{className:"badge"},form.slug)):null),error?/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("p",{className:"error"},error):null,message?/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("p",{className:"success"},message):null,loading?/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("p",{className:"muted"},"Loading form\u2026"):null,!loading&&form?/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("div",{className:"grid-two",style:{marginTop:16}},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("div",{className:"panel"},/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("h2",{style:{marginTop:0,fontSize:"1.15rem"}},"Edit"),form.description?/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement("p",{className:"muted"},form.description):null,/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(DynamicForm,{schema:form.schema,values:values,onChange:setValues,onSubmit:onSave,submitLabel:saving?`Saving…`:`Save`,disabled:saving})),/*#__PURE__*/external_C_Projects_Websites_CASE_STUDY_FORM_node_modules_react_index_js_default().createElement(FormPreview,{schema:form.schema,values:values})):null);}

/***/ }),

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

/***/ 9086:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ apiJson),
/* harmony export */   y: () => (/* binding */ apiUrl)
/* harmony export */ });
/* provided dependency */ var fetch = __webpack_require__(3492);
/**
 * In development, Gatsby proxies `/api` to the Express server.
 * In production, set GATSBY_API_URL to your API origin (no trailing slash).
 */function apiUrl(path){const base=typeof process!==`undefined`&&({}).GATSBY_API_URL?String(({}).GATSBY_API_URL).replace(/\/$/,``):``;if(!path.startsWith(`/`))return`${base}/${path}`;return base?`${base}${path}`:path;}async function apiJson(path,options={}){const res=await fetch(apiUrl(path),{...options,headers:{"Content-Type":`application/json`,...(options.headers||{})}});const text=await res.text();let data=null;try{data=text?JSON.parse(text):null;}catch{data=text;}if(!res.ok){const err=new Error(data&&data.error||res.statusText||`Request failed`);err.status=res.status;err.body=data;throw err;}return data;}

/***/ })

};
;
//# sourceMappingURL=component---src-pages-form-[slug]-jsx.js.map