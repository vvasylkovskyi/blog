import { Link } from "react-router-dom";
import { isDesktop } from "../../utils/is-desktop";
import { useEffect } from "react";

type HeaderProps = {
  handlePreloadAllPosts: () => void;
  location: Location;
};

const Header = ({ handlePreloadAllPosts, location }: HeaderProps) => {
  useEffect(() => {
    handlePreloadAllPosts();
  }, []);
  return (
    <header className="header-nav">
      <nav className="header__inner-nav">
        <div id="logo">
          <Link
            to={"/"}
            className="header-logo--wrapper"
            onMouseOver={() => handlePreloadAllPosts()}
          >
            <img
              src="/static/code-logo.svg"
              className="logo-image"
              alt="Code Logo"
              width={isDesktop() ? "32" : "32"}
              height={isDesktop() ? "41" : "32"}
            />
            <h1 className="header-title">Viktor Vasylkovskyi</h1>
          </Link>
        </div>
        <div className="navigation">
          <div className="navigation-menu-item--wrapper">
            <Link
              to={"/"}
              className={`navigation-menu-item navigation-menu-item--blog ${
                location.pathname !== "/about"
                  ? "navigation-menu-item--blog-active"
                  : ""
              }`}
              onMouseOver={() => handlePreloadAllPosts()}
            >
              Blog
            </Link>
          </div>
          {/* <div className="navigation-menu-item--wrapper">
            <Link
              to={'/about'}
              className={`navigation-menu-item navigation-menu-item--about ${
                location.pathname === '/about'
                  ? 'navigation-menu-item--about-active'
                  : ''
              }`}
            >
              About
            </Link>
          </div> */}
          <div className="navigation-menu-item--wrapper">
            <a
              href="https://github.com/vvasylkovskyi"
              className="navigation-menu-item navigation-menu-item--github"
              target="_blank"
            >
              Github
            </a>
          </div>
        </div>

        {/* <div className="theme-mode__wrapper">
          <button
            type="button"
            className="theme-mode--button"
            onClick={handleToggleMode}
          >
            <div className="theme-mode--toggle">
              {mode === 'night' && (
                <img src="/static/night.png" className="theme-mode--image" />
              )}
              {mode === 'day' && (
                <img src="/static/day.png" className="theme-mode--image" />
              )}
            </div>
          </button>
        </div> */}
      </nav>
    </header>
  );
};

export default Header;
