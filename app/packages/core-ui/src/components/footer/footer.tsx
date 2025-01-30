import { isDesktop } from "../../utils/is-desktop";

export const Footer = () => {
  const footerText = isDesktop()
    ? "© Viktor Vasylkovskyi all rights reserved"
    : "© Viktor Vasylkovskyi";
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <p>{footerText}</p>

        <div className="footer-icons-container">
          <a
            href="https://github.com/vvasylkovskyi"
            aria-label="Github"
            className="icon-container"
            target="_blank"
          >
            <img
              className="footer-icon"
              width={isDesktop() ? "30" : "25"}
              height={isDesktop() ? "30" : "25"}
              alt="Github"
              src="/static/github.svg"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/viktor-vasylkovskyi-708b1712b/"
            aria-label="LinkedIn"
            className="icon-container"
            target="_blank"
          >
            <img
              className="footer-icon"
              width={isDesktop() ? "30" : "25"}
              height={isDesktop() ? "30" : "25"}
              src="/static/linkedin.svg"
              alt="LinkedIn"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};
