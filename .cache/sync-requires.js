
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---src-pages-admin-jsx": preferDefault(require("C:\\Projects\\Websites\\CASE_STUDY_FORM\\src\\pages\\admin.jsx")),
  "component---src-pages-form-[slug]-jsx": preferDefault(require("C:\\Projects\\Websites\\CASE_STUDY_FORM\\src\\pages\\form\\[slug].jsx")),
  "component---src-pages-index-jsx": preferDefault(require("C:\\Projects\\Websites\\CASE_STUDY_FORM\\src\\pages\\index.jsx"))
}

