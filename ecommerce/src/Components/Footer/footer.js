import { Link } from "react-router-dom";
import QRImg from "../../assets/imgFooter/QR.png";
import { FaFacebookSquare } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <hr style={{ border: '1px solid #007bff', margin: '0' }}/>
      <div className="container">

        <div className="row mt-4 linksWrap">
          <div className="col">
            <h5>Hỗ trợ khách hàng</h5>
            <ul className="textLink">
              <li>
                <Link to="#">Hotline: 1900 9090</Link>
              </li>
              <li>
                <Link to="#">Gửi yêu cầu hỗ trợ</Link>
              </li>
              <li>
                <Link to="#">
                  Hỗ trợ khách hàng: <br />
                  hotro.bookstores@gmail.com
                </Link>
              </li>
            </ul>
          </div>

          <div className="col">
            <h5>Chi tiết đặt hàng</h5>
            <ul className="textLink">
              <li>
                <Link to="#">Hướng dẫn đặt hàng</Link>
              </li>
              <li>
                <Link to="#">Chính sách kiểm hàng</Link>
              </li>
              <li>
                <Link to="#">Chính sách đổi trả</Link>
              </li>
            </ul>
          </div>

          <div className="col">
            <h5>Kết nối với chúng tôi</h5>
            <ul className="social-links">
              <li>
                <Link to="#">
                  <FaFacebookSquare />
                </Link>
              </li>
              <li>
                <Link to="#">
                  <SiZalo />
                </Link>
              </li>
              <li>
                <Link to="#" className="youtube-link">
                  <FaYoutube />
                </Link>
              </li>
            </ul>
          </div>

          <div className="col">
            <h5>Phương thức thanh toán</h5>
            <img src={QRImg} alt="qr img" />
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
