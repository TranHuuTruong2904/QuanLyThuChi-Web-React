import React from "react";
import "../assets/css/app.css"

class UserFooter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <footer id="footer" className="">
        <footer className="bg-light fixed-bottom" id="tempaltemo_footer">
          <div className="container footer-center">
            <div className="row">
              <div className="col-md-4 pt-5">
                <h3 className="h3 fw-bolder text-dark border-bottom pb-3 border-light">
                  Thông tin liên hệ:
                </h3>
                <p className="text-dark">
                  Email : tranhuutruong290401@gmail.com
                </p>
                <p className="text-dark">Số điện thoại : 0987654321</p>
              </div>

              <div className="col-md-2 pt-5">
                <h3 className="h3 fw-bolder text-dark border-bottom pb-3 border-light">
                  Fanpage
                </h3>
                <a
                  className="btn btn-primary btn-floating m-1"
                  href="https://www.facebook.com/profile.php?id=100091576287029&sk=photos"
                  role="button"
                >
                  <i className="fa fa-facebook"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </footer>
    );
  }
}

export default UserFooter;
