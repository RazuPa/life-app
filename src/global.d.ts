// ============================================================
// GLOBAL TYPE DECLARATIONS
// ============================================================

// Standard CSS imports
declare module "*.css";

// CSS Modules
declare module "*.module.css" {
  const classes: {
    readonly [key: string]: string;
  };

  export default classes;
}