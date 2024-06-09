import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container py-4">
        <div className="row py-5">
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="text-uppercase mb-3">Customer services</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <a className="footer-link" href="#">
                  Help &amp; Contact Us
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Returns &amp; Refunds
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Online Stores
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="text-uppercase mb-3">Company</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <a className="footer-link" href="https://c4ei.net" target="_blank">
                  Available Services
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Latest Posts
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-uppercase mb-3">Social media</h6>
            <ul className="list-unstyled mb-0">
            <li>
                <a className="footer-link" href="https://www.threads.net/@c4ei_net" target="_blank">
                  THREAD
                </a>
              </li>
              <li>
                <a className="footer-link" href="https://t.me/aah_mining" target="_blank">
                  TELEGRAM
                </a>
              </li>
              <li>
                <a className="footer-link" href="https://twitter.com/c4ei_net" target="_blank">
                  Twitter
                </a>
              </li>              
            </ul>
          </div>
        </div>
        <div
          className="border-top pt-4"
          style={{ borderColor: "#1d1d1d !important" }}
        >
          <div className="row">
            <div className="col-lg-6">
              <p className="small text-muted mb-0">
                &copy; 2024 All rights reserved.
              </p>
            </div>
            <div className="col-lg-6 text-lg-right">
              <p className="small text-muted mb-0">
                AAH coin buy{" "}
                <a className="text-white reset-anchor" href="https://c4ex.net" target="_blank">
                  c4ex.net
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
