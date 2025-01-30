import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

type PostItemProps = {
  url: string;
  title: string;
  date: string;
  metaText: string;
  category: string;
  handlePreloadBlog: (url: string) => void;
};

export const PostItem = ({
  url,
  title,
  date,
  metaText,
  handlePreloadBlog,
}: PostItemProps) => {
  const listItemRef: any = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Item is in view
          handlePreloadBlog(url);
        }
      });
    });

    observer.observe(listItemRef.current);

    // Cleanup the observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [url]);

  return (
    <Link
      className="post-link"
      to={`/posts/${url}`}
      onMouseOver={() => handlePreloadBlog(url)}
    >
      <div className="post-item__card" ref={listItemRef}>
        <div className="date-container">{<p>{date}</p>}</div>

        <div className="title-container">{<p>{title}</p>}</div>

        <div className="meta-text--container">
          <p className="meta-text">{metaText}</p>
        </div>
      </div>
    </Link>
  );
};
