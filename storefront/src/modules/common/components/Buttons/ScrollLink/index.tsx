import Link from "next/link";
import LocalizedClientLink from "../../localized-client-link";

export default function ScrollLink({
  href,
  text,
  className,
  textColor,
  borderColor,
  borderR = false,
  borderL = false,
}: {
  href: string;
  text: string;
  className?: string;
  textColor?: string;
  borderColor?: string;
  borderR?: boolean;
  borderL?: boolean;
}) {
  return (
    <div className="ScrollLink">
        <button 
          className="button"
            style={{
            textDecoration: "none",
            borderRight: borderR ? `1px solid ${borderColor}` : "var(--ButtonBorder)",  
            borderLeft: borderL ? `1px solid ${borderColor}` : "var(--ButtonBorder)",
          }}
        >
            <div className="slider">
                <div className="el">
                    <PerspectiveText label={text} href={href} className={className} textColor={textColor}/>
                </div>
                <div className="el">
                    <PerspectiveText label={text} href={href} className={className} textColor={textColor}/>
                </div>
            </div>
        </button>
    </div>
  );
}

function PerspectiveText({label, href, className, textColor}: {label: string; href: string; className?: string; textColor?: string}) {
  return (    
      <LocalizedClientLink href={`/${href}`} className="perspectiveText">
          <p 
            className={className}
            style={{
              color: textColor || "var(--ChText)",
            }}
          >
            {label}
          </p>
          <p 
            className={className}
            style={{
              color: textColor || "var(--ChText)",
            }}
          >
            {label}
          </p>
      </LocalizedClientLink>
  )
}