import { isDesktop } from "../../utils/is-desktop";

type SkillCardProps = {
  iconUrl: string;
  title: string;
  iconWidthDesktop: string;
  iconWidthMobile: string;
  iconHeightDesktop: string;
  iconHeightMobile: string;
  iconAlt: string;
};

const SkillCard = ({
  iconUrl,
  title,
  iconWidthDesktop,
  iconWidthMobile,
  iconHeightDesktop,
  iconHeightMobile,
  iconAlt,
}: SkillCardProps) => {
  return (
    <div className="skill__card">
      <div className="skill-icon__container">
        <img
          className="skill-icon"
          width={isDesktop() ? iconWidthDesktop : iconWidthMobile}
          height={isDesktop() ? iconHeightDesktop : iconHeightMobile}
          src={iconUrl}
          alt={iconAlt}
        />
      </div>
      <div className="skill-title__wrapper">
        <p className="skill-title">{title}</p>
      </div>
    </div>
  );
};

export default SkillCard;
