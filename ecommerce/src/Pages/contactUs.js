import React from 'react';
import '../css/freeShip.css';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';

const ContactPage = () => {
  return (
    <section className="freeship-page">
      <div className="container">
        <div className="freeship-content">
          <h1 className="freeship-title">Contact</h1>
          <p className="freeship-description">
            Hãy liên hệ với chúng tôi để được hỗ trợ sớm nhất!!! <br/>
            <LocalPhoneIcon/><LocalPhoneIcon/><LocalPhoneIcon/> 1900 9090 <br/>
            Bạn cũng có thể gửi email cho chúng tôi, chúng tôi sẽ phản hồi sớm nhất có thể. <br/>
            <EmailIcon/><EmailIcon/><EmailIcon/> hotro.bookstores@gmail.com <br/>
            Rất hân hạnh được phục vụ quý khách hàng.

          </p>
        </div>
        <div className="freeship-animation">
        <img 
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGNjMWFqMnN0dTlleTB3a3BpdXJpdjR3a3d1dmU5YjJtdWVmaGd3ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KCpK92XQHCutWBUz3W/giphy.webp" 
            alt="Delivery Animation" 
            style={{ width: '30%', height: 'auto' }} 
        />
        </div>
      </div>
    </section>
  );
};

export default ContactPage;