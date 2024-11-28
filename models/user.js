const mongoose = require ('mongoose')
const Schema = mongoose.Schema
const {isEmail} = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is require"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Pasword is required"],
      minLength: [8, "minimum passsword length is 8"],
      // regEx stands for regular expression it is used to check regular express.
      validate: {
        validator: function (v) {
          const test =  /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@.#$!%?&])[A-Za-z\d@.#$!%?&]+$/.test(
            v
          );
          return !test
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
    },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next){
    if(!this.isModified("password")) return
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next() 
})

module.exports = mongoose.model('User', userSchema)