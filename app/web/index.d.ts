declare module '@readme/markdown' {
  const rdmd: (content: any) => any;
  const react: (content: string, options?: any) => any;
  export {react};
  export default rdmd;
}

declare type PreloadWebpackConfig = {
  rel: string;
  include: string;
  fileWhitelist: Array<any>;
};
