import { Button } from "@material-ui/core";
import React from "react";
import { profile } from "../../images";
import "../../App.css";

function UploadPicture(props) {
  return (
    <div>
      <div className="profile-picture-container">
        <img src={profile} alt="profile"></img>
      </div>
      <input
        accept="image/*"
        className="input"
        style={{ display: "none" }}
        id="raised-button-file"
        multiple
        type="file"
      />
      <label htmlFor="raised-button-file">
        <Button variant="raised" component="span" className="button">
          Upload
        </Button>
      </label>
    </div>
  );
}

export default UploadPicture;
