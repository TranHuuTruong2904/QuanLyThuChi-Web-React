import React from "react";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  // props.isActive
  render() {
    return (
      <nav
        className={
          this.props.isActive
            ? "navbar navbar-expand-lg navbar-light bg-light fixed-top border-bottom fixed-top-left"
            : "navbar navbar-expand-lg navbar-light bg-light fixed-top border-bottom fixed-top-left2"
        }
      >
        <div className="container-fluid">
          <button
            onClick={() => {
              this.props.onToggle();
            }}
            className=""
            type="button"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
              {/* <li className="nav-item"><a data-bs-toggle="modal" data-bs-target="#add-lead-modal"  className="nav-link highlighted-text" href="#!">Add lead</a></li> */}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
