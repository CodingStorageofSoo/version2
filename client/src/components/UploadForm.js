import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";
import { set } from "mongoose";

const UploadForm = () => {
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const defaultFileName = "Please upload img file";
  const [files, setFiles] = useState(null);

  const [imgSrc, setImgSrc] = useState(null);
  const [fileName, setFileName] = useState(defaultFileName);

  const [previews, setPreviews] = useState([]);

  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true); // default: public

  const imageSelectHandler = async (event) => {
    const imageFiles = event.target.files;
    setFiles(imageFiles);
    const imagePreviews = await Promise.all(
      [...imageFiles].map(async (imageFile) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.onload = (e) => resolve(e.target.result);
          } catch (err) {
            reject(err);
          }
        });
      })
    );

    const imageFile = imageFiles[0];
    setFileName(imageFile.name);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (e) => setImgSrc(e.target.result);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let file of files) formData.append("image", file);

    formData.append("public", isPublic);
    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });
      if (isPublic) setImages([...images, ...res.data]);
      else setMyImages([...myImages, ...res.data]);

      toast.success("Success");
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      toast.error(err.response.data.message);
      setPercent(0);
      setFileName(defaultFileName);
      setImgSrc(null);
      toast.error("Fail");
    }
  };

  const previewImages = previews.map((preview, index) => (
    <img
      key={index}
      src={preview.imgSrc}
      alt=""
      className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
    />
  ));

  return (
    <form onSubmit={onSubmit}>
      {previewImages}
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input
          id="image"
          type="file"
          multiple={true}
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </div>

      <input
        type="checkbox"
        id="public-check"
        value={!isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      <label htmlFor="public-check">Private</label>
      <button
        type="submit"
        style={{
          width: "100%",
          height: 40,
          borderRadius: 3,
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default UploadForm;
