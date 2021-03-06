import React, {createRef} from 'react';
import axios from 'axios';
import { getUser } from "../Redux/Reducers/reducer";
import { v4 as randomString } from "uuid";
import { useSelector, useDispatch } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';

const PictureUpload = props => {
    const user = useSelector(state => state.user),
          dispatch = useDispatch();

    const fileInput = createRef();

    const getSignedRequest = () => {

      
      const file = fileInput.current.files[0];
      if (!file) {
        return alert('Please insert a file before uploading!')
      }
      const fileName = `${randomString()}-${file.name.replace(/\s/g, "-")}`;

      axios
        .get("/sign-s3", {
          params: {
            "file-name": fileName,
            "file-type": file.type,
          },
        })
        .then((response) => {
          const { signedRequest, url } = response.data;
          uploadFile(file, signedRequest, url);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const uploadFile = async (file, signedRequest, url) => {
      const options = {
        headers: {
          "Content-Type": file.type,
        },
      };

      try {
        const clearProfilePic = await axios.post(`/api/s3/deletePic/${user.user_id}`, {img_url: user.picture_url})
        const uploadPic = await axios.put(signedRequest, file, options);
        const insertPic = await axios.put(`/api/user/profile-pic/${user.user_id}`, {img_url: url});
        const newUser = {...user, picture_url: url}
        dispatch(getUser(newUser));
        console.log('picture uploaded')
      } catch (err) {
        if (err.response.status === 403) {
          alert(
            `Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n${err.stack}`
          );
        } else {
          alert(`ERROR: ${err.status}\n ${err.stack}`);
        }
      }
    };

    const profilePic = {
      backgroundImage: `url(${user.picture_url})`,
    }

    return (
      <section className="picture">
        <div className="profile-img-container" style={profilePic}></div>

        <div className="edit-picture">
          <p>Change Profile Picture </p>
          <section className='file-btn-container'>
            <input
              type="file"
              accept="image/*0"
              multiple={false}
              ref={fileInput}
            />
            <button className='file-btn' onClick={getSignedRequest}>Upload</button>
          </section>
        </div>
      </section>
    );
}

export default PictureUpload