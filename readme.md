packages needed at start

express - for api endpoints
mongoose - connect to db
bcryptjs - encrypt our password
jsonwebtoken

modules - collection of functionalities

models - are objects that helps you connect with collection

- creating userModel
- generating token jwt

end points

- register
- login
- track foods (accessed with token)
- show my tracked foods (accessed with token)

will create a middleware to access those routes

we send token with request headers

adding middleware "verifytoken" to check

- auth token is present?
- auth token is correct?
