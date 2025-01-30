import React from "react";
import SkillCard from "../../components/skill-card/skill-card";

import { httpRequest } from "../../http/request";

const skills = [
  {
    iconUrl: "/static/javascript-icon.svg",
    title: "Javascript/Typescript",
    iconWidthDesktop: "45",
    iconWidthMobile: "34",
    iconHeightDesktop: "27",
    iconHeightMobile: "27",
    iconAlt: "Javascript/Typescript",
  },
  {
    iconUrl: "/static/webgl-icon.svg",
    title: "HTML/WebGL",
    iconWidthDesktop: "40",
    iconWidthMobile: "40",
    iconHeightDesktop: "20",
    iconHeightMobile: "24",
    iconAlt: "WebGL",
  },
  {
    iconUrl: "/static/react-icon.svg",
    title: "ReactJS/ExpressJS",
    iconWidthDesktop: "45",
    iconWidthMobile: "40",
    iconHeightDesktop: "35",
    iconHeightMobile: "35",
    iconAlt: "React",
  },
  {
    iconUrl: "/static/play-icon.svg",
    title: "Web Video MSE/EME",
    iconWidthDesktop: "45",
    iconWidthMobile: "40",
    iconHeightDesktop: "28",
    iconHeightMobile: "28",
    iconAlt: "MSE/EME",
  },
  {
    iconUrl: "/static/webpack-icon.svg",
    title: "Webpack",
    iconWidthDesktop: "34",
    iconWidthMobile: "34",
    iconHeightDesktop: "34",
    iconHeightMobile: "34",
    iconAlt: "Webpack",
  },
  {
    iconUrl: "/static/docker-icon.svg",
    title: "Docker/Jenkins",
    iconWidthDesktop: "45",
    iconWidthMobile: "40",
    iconHeightDesktop: "36",
    iconHeightMobile: "36",
    iconAlt: "Docker",
  },
  {
    iconUrl: "/static/settings-icon.svg",
    title: "Embedded Systems",
    iconWidthDesktop: "45",
    iconWidthMobile: "40",
    iconHeightDesktop: "33",
    iconHeightMobile: "33",
    iconAlt: "Settings",
  },
  {
    iconUrl: "/static/linux-icon.svg",
    title: "Linux",
    iconWidthDesktop: "45",
    iconWidthMobile: "40",
    iconHeightDesktop: "33",
    iconHeightMobile: "33",
    iconAlt: "Linux",
  },
  {
    iconUrl: "/static/lerna.svg",
    title: "Lerna",
    iconWidthDesktop: "45",
    iconWidthMobile: "40",
    iconHeightDesktop: "35",
    iconHeightMobile: "35",
    iconAlt: "Lerna",
  },
];

const About = () => {
  const downloadResume = async () => {
    const resume: any = await httpRequest.get(`/get-resume`, {
      responseType: "blob",
    });
    const downloadUrl = window.URL.createObjectURL(resume.data);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "Viktor_Vasylkovskyi_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <div className="about-container">
        <div className="heading__wrapper">
          <h1 className="heading-h1">About</h1>
        </div>
        <div className="flex__container">
          <div className="photo-flex-wrapper">
            <img
              src="./static/photo.png"
              className="photo of me"
              width="256"
              height="254"
              alt="Photo of Vvasylkovskyi Next to the plane"
            />
          </div>

          <div className="inner__flex-wrapper">
            <div className="about-me-container">
              <p className="body-text">
                Hello, my name is Viktor, and I am a dedicated Software
                Engineer. This portfolio page has been meticulously crafted to
                present my career in the most effective manner. It serves as a
                dynamic platform where I can showcase an array of personal and
                professional projects.
              </p>
              <p className="body-text">
                For me, programming transcends beyond a mere profession; it is a
                passionate hobby. Consequently, this website is regularly
                updated with insightful blogs and innovative projects,
                reflecting my continuous growth and engagement in the field.
              </p>
            </div>

            <div className="resume-and-online__flex-wrapper">
              <div className="resume-container">
                <h2 className="sub-heading">My Resume</h2>
                <button
                  className="download-button"
                  type="button"
                  onClick={() => downloadResume()}
                >
                  <p className="download-button-text">resume_viktor.pdf</p>
                </button>
              </div>

              <div className="online-container">
                <h2 className="sub-heading">Online</h2>
                <div className="online-wrapper">
                  <div className="link__wrapper">
                    <a
                      href="https://github.com/vvasylkovskyi"
                      className="link-text"
                      target="_blank"
                    >
                      Github
                    </a>
                  </div>
                  <div className="link__wrapper">
                    <a
                      href="https://www.linkedin.com/in/viktor-vasylkovskyi-708b1712b/"
                      className="link-text"
                      target="_blank"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="studies-container">
              <h2 className="sub-heading">Education</h2>
              <p className="body-text">
                I have authored a paper on robotics and blockchain, which is
                available for reference. If you are interested, please feel free
                to reach out to me, and I will be happy to share a PDF version
                of the paper.
              </p>
              <button className="download-button">
                <a
                  href="https://www.researchgate.net/publication/347779499_BlockRobot_Increasing_Privacy_in_Human_Robot_Interaction_by_Using_Blockchain"
                  className="link-text"
                  target="_blank"
                >
                  ResearchPaper
                </a>
              </button>
            </div>
          </div>
        </div>

        <div className="skills-container">
          <h2 className="sub-heading">My Skills</h2>
          <div className="skill-wrapper row">
            {skills.map((skill) => (
              <div
                key={skill.iconUrl}
                className="col-12 col-lg-4 col-md-4 skill-item__wrapper"
              >
                <SkillCard
                  iconUrl={skill.iconUrl}
                  title={skill.title}
                  iconWidthDesktop={skill.iconWidthDesktop}
                  iconWidthMobile={skill.iconWidthMobile}
                  iconHeightDesktop={skill.iconHeightDesktop}
                  iconHeightMobile={skill.iconHeightMobile}
                  iconAlt={skill.iconAlt}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default About;
