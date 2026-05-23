import { useTranslations } from "next-intl"

interface FooterColumn {
  heading: "product.heading" | "company.heading" | "support.heading"
  links: ReadonlyArray<
    | "product.aiPlanner"
    | "product.experience"
    | "product.koreaStory"
    | "company.about"
    | "company.blog"
    | "company.press"
    | "company.careers"
    | "support.helpCenter"
    | "support.contact"
    | "support.privacy"
    | "support.terms"
  >
}

const FOOTER_COLUMNS: ReadonlyArray<FooterColumn> = [
  {
    heading: "product.heading",
    links: ["product.aiPlanner", "product.experience", "product.koreaStory"],
  },
  {
    heading: "company.heading",
    links: [
      "company.about",
      "company.blog",
      "company.press",
      "company.careers",
    ],
  },
  {
    heading: "support.heading",
    links: [
      "support.helpCenter",
      "support.contact",
      "support.privacy",
      "support.terms",
    ],
  },
]

export default function Footer() {
  const t = useTranslations("footer")
  const tSite = useTranslations("site")
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-name">{tSite("name")}</div>
            <p className="footer-brand-tagline">{t("brand.tagline")}</p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="footer-col">
              <div className="footer-col-heading">{t(col.heading)}</div>
              {col.links.map((link) => (
                <a key={link} className="footer-link" href="#">
                  {t(link)}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>{t("copyright")}</span>
          <span>{t("bottomTagline")}</span>
        </div>
      </div>
    </footer>
  )
}
