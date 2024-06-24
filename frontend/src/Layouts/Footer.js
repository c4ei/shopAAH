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
회사명 쇼핑뱅크 주소 인천 부평구 체육관로 18 5층 6050호 대경프라자<br/>
사업자 등록번호 376-26-00310 대표 이규희 전화 010-6444-0111 팩스<br/>
통신판매업신고번호 제2023인천부평1587호 개인정보 보호책임자<br/>
씨포이아이(C4EI) 건강기능식품 영업신고서 제2019-0060180호 <br/>
              </p>
              <b>C4EI 는 쇼핑뱅크의 파트너 사로 AAH 결재/지불을 대행 합니다.</b>
            </div>
            <div className="col-lg-6 text-lg-right">
              <p className="small text-muted mb-0">
                <a className="text-white reset-anchor" href="https://c4ex.net" target="_blank">
                  c4ex.net</a> - AAH coin 구매 
                <br/>
                <a className="text-white reset-anchor" href="https://c4ei.net" target="_blank">
                  c4ei.net</a> - C4EI, AAH Coin 정보
                <br/><br/>
                &copy; 2024 All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
