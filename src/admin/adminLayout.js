import React from "react";
import Header from "./../common/header";
import Sidebar from "./../common/sidebar";
import { Preloader, Bars } from "react-preloader-icon";

const adminLayout = (ChildComponent) => {
  class AdminLayout extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        pageLoaded: false,
        saveLeadClickEvent: "",
        isActive: true,
      };
    }

    componentDidMount() {
      setTimeout(() => {
        this.setState(() => ({
          pageLoaded: true,
        }));
      }, 1000);
    }

    renderHtml() {
      if (!this.state.pageLoaded) {
        return (
          <div className="loading-page">
            <div className="center">
              <Preloader
                use={Bars}
                size={60}
                strokeWidth={10}
                strokeColor="#f7b085"
                duration={600}
              />
            </div>
          </div>
        );
      }

      return (
        <div className="d-flex" id="wrapper">
          {/* <!-- Sidebar--> */}
          <Sidebar isActive={this.state.isActive} />
          {/* <!-- Page content wrapper--> */}
          <div
            className={this.state.isActive ? "main" : "main close "}
            id="page-content-wrapper"
          >
            {/* <!-- Top navigation--> */}
            <Header
              onToggle={() => {
                this.setState({
                  isActive: !this.state.isActive,
                });
              }}
              isActive={this.state.isActive}
            />
            {/* <!-- Page content--> */}
            <div className="container-fluid content-container">
              <ChildComponent isActive={this.state.isActive} />
            </div>
          </div>
        </div>
      );
    }


    handleParentData = (e) => {
      console.log(e);
    };

    render() {
      return <>{this.renderHtml()}</>;
    }
  }

  return AdminLayout;
};

export default adminLayout;
