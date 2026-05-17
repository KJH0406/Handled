import Icon from "../ui/Icon"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cols">
          <div className="stack-md">
            <div className="t-title-md ink">Support</div>
            <a className="t-body-sm body" href="#">
              Help center
            </a>
            <a className="t-body-sm body" href="#">
              Cancellation
            </a>
            <a className="t-body-sm body" href="#">
              Safety info
            </a>
            <a className="t-body-sm body" href="#">
              Report
            </a>
          </div>
          <div className="stack-md">
            <div className="t-title-md ink">Hosting</div>
            <a className="t-body-sm body" href="#">
              Become a host
            </a>
            <a className="t-body-sm body" href="#">
              Host an experience
            </a>
            <a className="t-body-sm body" href="#">
              Community forum
            </a>
            <a className="t-body-sm body" href="#">
              Responsible hosting
            </a>
          </div>
          <div className="stack-md">
            <div className="t-title-md ink">Handled</div>
            <a className="t-body-sm body" href="#">
              About
            </a>
            <a className="t-body-sm body" href="#">
              Newsroom
            </a>
            <a className="t-body-sm body" href="#">
              Partners
            </a>
            <a className="t-body-sm body" href="#">
              Investors
            </a>
          </div>
        </div>
        <div
          className="row between"
          style={{ paddingTop: 24, flexWrap: "wrap", gap: 16 }}
        >
          <span className="t-caption-sm muted">
            © 2026 Handled, Inc. · Korean local experiences for international
            travelers
          </span>
          <div className="row row-gap-base">
            <span className="row row-gap-xs t-caption-sm ink">
              <Icon name="globe" size={14} /> English
            </span>
            <span className="t-caption-sm ink">$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
