const { Schema, model } = require("mongoose");

const ticketSchema = new Schema(
    {
      title: {
        type: String,
        required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        description:{
            type: String,
            required: true
        },
        gitHubRepo: {
        type: String,
        required: true,
        },
        image: {
            type: String,
            required: true,
        },
        solution: {
            text: String,
            author: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            imgSolution: String
        },
        isPending: {type: Boolean, default: true},
        technologiesUsed: [String]
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`
      timestamps: true,
    }
);

const Ticket = model("Ticket", ticketSchema);

module.exports = Ticket;