import { useTranslations } from "next-intl"
import Icon from "../ui/Icon"

export default function Footer() {
  const t = useTranslations("footer")
  const tc = useTranslations("common")
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cols">
          <div className="stack-md">
            <div className="t-title-md ink">{t("support.heading")}</div>
            <a className="t-body-sm body" href="#">
              {t("support.helpCenter")}
            </a>
            <a className="t-body-sm body" href="#">
              {t("support.cancellation")}
            </a>
            <a className="t-body-sm body" href="#">
              {t("support.safety")}
            </a>
            <a className="t-body-sm body" href="#">
              {t("support.report")}
            </a>
          </div>
          <div className="stack-md">
            <div className="t-title-md ink">{t("company.heading")}</div>
            <a className="t-body-sm body" href="#">
              {t("company.about")}
            </a>
            <a className="t-body-sm body" href="#">
              {t("company.newsroom")}
            </a>
            <a className="t-body-sm body" href="#">
              {t("company.partners")}
            </a>
            <a className="t-body-sm body" href="#">
              {t("company.investors")}
            </a>
          </div>
        </div>
        <div
          className="row between"
          style={{ paddingTop: 24, flexWrap: "wrap", gap: 16 }}
        >
          <span className="t-caption-sm muted">{t("copyright")}</span>
          <div className="row row-gap-base">
            <span className="row row-gap-xs t-caption-sm ink">
              <Icon name="globe" size={14} /> English
            </span>
            <span className="t-caption-sm ink">$ {tc("currency")}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
