const { Schema, model } = require("mongoose");

const ticketSchema = new Schema(
    {
      title: {
        type: String,
        required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
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
            type: String,
            required: true,
            author: {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        },
        imgSolution: {
            type: String,
        },
        isPending: {type: Boolean, default: true}
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`
      timestamps: true,
    }
);

const Ticket = model("Ticket", ticketSchema);

module.exports = Ticket;