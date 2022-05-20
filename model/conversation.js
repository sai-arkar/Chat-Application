const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    senderId: {
      type: String
    },
    receiverId: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
