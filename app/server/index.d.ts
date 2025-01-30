declare module "@readme/markdown" {
  const rdmd: (content: any) => any;
  const react: (content: string, options?: any) => any;
  export { react };
  export default rdmd;
}

declare module "@vvasylkovskyi/core-ui" {
  const App: any;
  const getMarkedHTML: any;
}
