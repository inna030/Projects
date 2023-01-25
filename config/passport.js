const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
passport.serializeUser((user, done) => {
  console.log("serialize user");
  done(null, user._id); //save the id of mongoDB to session
  //signed id then gives to the user as the form of cookie
});
passport.deserializeUser(async (_id, done) => {
  console.log("deserialize User");
  let foundUser = await User.findOne({ _id });
  done(null, foundUser);
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Going to the google Strategy's area");
      console.log(profile);
      console.log("======");
      let foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (foundUser) {
        done(null, foundUser);
      } else {
        console.log("It's a new user. Need to register.");
        let newUser = new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.emails[0].value,
        });
        let savedUser = await newUser.save();
        console.log("Succefully created new user in database.");
        done(null, savedUser);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    let foundUser = await User.findOne({ email: username });
    if (foundUser) {
      let result = await bcrypt.compare(password, foundUser.password);
      if (result) {
        done(null, foundUser);
      } else {
        done(null, false);
      }
    } else {
      done(null, false);
    }
  })
);
