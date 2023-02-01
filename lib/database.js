const mongoose = require('mongoose').default
const { CUSTOM_ERROR } = require('./errors')

const SchemaTypes = mongoose.Schema.Types

mongoose.set('strictQuery', false)

const phoneNoSchema = new mongoose.Schema({
  countryCode: {
    type: SchemaTypes.Number,
    required: false,
  },
  number: {
    type: SchemaTypes.Number,
    required: [true, 'Phone no. is required'],
    unique: [true, 'A user exists with the phone no.'],
  },
})

const UserDetailSchema = new mongoose.Schema({
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  dob: SchemaTypes.Date,
  email: {
    type: SchemaTypes.String,
    required: [true, 'Email is required'],
    unique: [true, 'a user exists with the email'],
  },
  phoneNo: phoneNoSchema,
})

const UserDetail = mongoose.model('User Detail', UserDetailSchema)

const connectToDB = () => {
  return mongoose.connect(process.env.MONGODB_URI, {}, (err) => {
    if (err) console.log('Failed to connect to Mongo DB', err)
    else console.log('Successfully connected to Mongo DB')
  })
}

/**
 * Adds User's name, dob, email, phoneno  in database
 * */
const addUserDetail = async (data) => {
  try {
    const user = await new UserDetail({
      ...data,
    }).save()

    console.log(user)
  } catch (err) {
    console.error(err)
    // A user with provided details already exists
    if (err.code && err.code == 11000) {
      throw new CUSTOM_ERROR(
        `A user with ${Object.keys(err.keyValue)} already exists`,
        409
      )
    }

    throw err
  }
}

const getUserDetails = async (pageNo, per_page = 15) => {
  return (
    (await UserDetail.find(null, {
      _id: false,
      dob: true,
      email: true,
      name: true,
      'phoneNo.countryCode': true,
      'phoneNo.number': true,
    })
      .skip((pageNo - 1) * per_page)
      .limit(per_page)) || []
  )
}

const getTotalUserEntries = async () => {
  return await UserDetail.count({})
}

module.exports = {
  connectToDB,
  addUserDetail,
  getUserDetails,
  getTotalUserEntries,
}
