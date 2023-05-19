import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const ImagePage = () => {
  const history = useHistory();
  const { imageId } = useParams();
  const { images, myImages, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext); // [me, setMe]
  const [hasLiked, setHasLiked] = useState(false);
  const image =
    images.find((image) => image._id === imageId) ||
    myImages.find((image) => image._id === imageId);
  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) {
      setHasLiked(true);
    }
  }, [me, image]);
  if (!image) return <h3>Loading...</h3>;

  const updateImage = (images, image) => {
    [...images.filter((image) => image._id !== imageId), image].sort((a, b) => {
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  };

  const onSubmit = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (result.data.public) setImages(updateImage(images, result.data));
    else setMyImages(updateImage(myImages, result.data));
    setHasLiked(!hasLiked);
  };

  const deleteHandler = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this image?"))
        return;
      const result = await axios.delete(`/images/${imageId}`);
      toast.success(result.data.message);
      setImages(images);
      setMyImages(myImages.filter((image) => image._id !== imageId));
      history.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h3>Image Page - {imageId}</h3>
      <img
        style={{
          width: "100%",
        }}
        alt={imageId}
        src={`http://localhost:8000/uploads/${image.key}`}
      />
      <span>Like {image.likes.length}</span>
      {me && image.user._id == me.userId && (
        <button
          style={{ float: "right", marginLeft: 10 }}
          onClick={deleteHandler}
        >
          {" "}
          Delete{" "}
        </button>
      )}
      <button
        style={{
          float: "right",
        }}
        onClick={onSubmit}
      >
        {hasLiked ? "Unlike" : "Like"}
      </button>
    </div>
  );
};

export default ImagePage;
