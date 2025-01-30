import { Helmet } from "react-helmet";

type HelmetProps = {
  title: string;
  meta: string;
};

const HelmetWrapper = ({ title, meta }: HelmetProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={meta} />
    </Helmet>
  );
};

export default HelmetWrapper;
