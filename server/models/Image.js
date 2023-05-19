const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Types.ObjectId, require: true, index: true },
      name: { type: String, require: true },
      username: { type: String, require: true },
    },
    likes: [{ type: mongoose.Types.ObjectId }],
    public: { type: Boolean, require: true, default: false },
    key: { type: String, require: true },
    originalFileName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("image", ImageSchema);
