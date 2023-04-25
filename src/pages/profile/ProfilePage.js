import { useState, useEffect } from "react";
import "../../assets/css/profile.css";
import userProfileLayout from "../../Information/userProfileLayout";
import axios from "../../api/axios";
import axiosApiInstance from "../../context/interceptor";

const ProfilePage = () => {
  const [username, setUserName] = useState([""]);
  const [email, setEmail] = useState([""]);
  const [firstname, setFirstName] = useState([""]);
  const [lastname, setLastName] = useState([""]);
  const [load, setLoad] = useState(false);
  const [profile, setProfile] = useState({});
  
  async function getProfileUser() {
    
    const result = await axiosApiInstance.get(
      axiosApiInstance.defaults.baseURL + `/api/user/profile`
    );
    setLoad(true);
    setProfile(result?.data?.userInfoModel);
  }

  useEffect(() => {
    getProfileUser();
  }, []);
  return (
    <>
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <h6 className="border-bottom pb-2 mb-0 mb-3">Personal Info</h6>
        <form>
          <div className="row">
            <div className="col">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Username
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={profile?.accountModel?.username}
                />
                <span className="input-group-text" id="basic-addon2">
                  <i className="fa fa-user"></i>
                </span>
              </div>
            </div>
            <div className="col">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email Address"
                  value={profile?.accountModel?.email}
                />
                <span className="input-group-text" id="basic-addon2">
                  @
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="exampleInputEmail1" className="form-label">
                First Name
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  value={profile.firstname}
                />
                <span className="input-group-text" id="basic-addon2">
                  <i className="fa fa-user"></i>
                </span>
              </div>
            </div>
            <div className="col">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Last Name
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  value={profile.lastname}
                />
                <span className="input-group-text" id="basic-addon2">
                  <i className="fa fa-user"></i>
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-default">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default userProfileLayout(ProfilePage);
