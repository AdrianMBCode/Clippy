# Clippy

# Clippy-back
Developed as our second project of our web development bootcamp at Ironhack Barcelona.

## About
Hi! We are Adrián, Rocío and Lucas, web developers. This project constitutes of a platform that connects self-taughts aspiring web developers with Senior web developers through a system similar to Slack's tickets. 

![Project Image](https://i.imgur.com/6k3J5gW.png "Project Image")

## Deployment
You can check the app fully deployed [here](https://afabregasm-back.herokuapp.com/api/).

## Work structure
We developed this project using [Trello](https://trello.com/home) to organize our workflow.

## Installation guide
- Fork this repo
- Clone this repo 

```shell
$ cd portfolio-back
$ npm install
$ npm start
```

## Models
#### User.model.js
```js
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "junior", "senior", "pending"]
});
```
#### Tickets.model.js
```js
  const ticketsSchema = new Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectID, ref: "User" },
  description: String,
  gitHubRepo: { type: String },
  image: String,
  solution: String,
  ImgSolution: String
});
```
#### Reviews.model.js
```js
  const reviewsSchema = new Schema({
  author: { type: Schema.Types.ObjectID, ref: "User" },
  description: String,
  images: [String],
  rating: Number
});
````


## User roles
| Role  | Capabilities                                                                                                                               | Property       |
| :---: | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| Admin  | Can login/logout. Can view all the profiles, tickets and answers. . Can accept or delete users.                                                                   | role: "admin" |
| Junior | Can login/logout. Can create, edit or delete tickets. Can create a new ticket. Can write reviews | role: "junior"  |
| Senior | Can login/logout. Can read tickets. Can create a solution to the tickets.| role: "senior"  |

## Routes
| Method | Endpoint                    | Require                                             | Response (200)                                                        | Action                                                                    |
| :----: | --------------------------- | --------------------------------------------------- |---------------------------------------------------------------------- | ------------------------------------------------------------------------- |

| GET    | /                           | -                                                   |                                                                       | Returns the "get started" view. |
| POST   | /register                     | const { username, email, password } = req.body      | json({user: user})                                                    | Registers the user in the database and returns the Log In form.        |
| POST   | /login                      | const { email, password } = req.body                | json({authToken: authToken})                                          | Logs in a user already registered.                                        |
| GET    | /junior/:id                 | const { id } = req.params                           | json({user})                                                          | Returns the view of the junior's profile view |
| GET    | /senior/:id                 | const { id } = req.params                           | json({user})                                                          | Returns the senior's profile view.                         |
| GET    | /junior/:id/ticket          | const { id } = req.params                           | json({user})                                                          | Returns the "create ticket" form.                  |
| POST   | /junior/:id/ticket          | const { title, description, gitHubRepo, image, user } = req.body | json({response})                                         | Creates a ticket in the database.                                 |
| GET   | /tickets                     | -                                                   | json([allTickets])                                                    | Returns an array with all the tickets in the database.                                 |
| PUT    | /junior/:id/ticket/:ticketId| const { ticketId } = req.params                     | json({ticket})                                                        | Edits a ticket that already exists on the database.               |
| GET   | /tickets/:id                 |    const { id } = req.params                        | json({ticket})                                                        | Returns one existing ticket in the database.            4
| POST   | /tickets/:id                |    const { id } = req.params                        | json({ticket})                                                        | Edits existing Ticket with provided solution by the Senior.                                 |
                      

---

Any doubts? Contact me!
<a href="https://www.behance.net/afabregasm"><img align="right" width="20px" src="https://www.linkedin.com/in/admartinbarcelo/" alt="Adrian's LinkedIn" /></a>
<a href="https://www.linkedin.com/in/afabregasm"><img align="right" width="20px" src="https://simpleicons.now.sh/linkedin/495f7e" alt="Lucas's LinkedIn" /></a>
<a href="mailto:contact@afabregasm.com"><img align="right" width="20px" src="https://www.linkedin.com/in/rociosalgadof/" alt="Rocio's LinkedIn" /></a>
