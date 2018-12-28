
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const UserSchema = new mongoose.Schema({

    email: { type: String, required: [true, "Email is required."], unique: true, trim: true },
    password: { type: String }

}, {
    timestamps: true
});

UserSchema.pre("save", function(next) {
    if (this.password && this.isModified("password")) {
        const salt = bcrypt.genSaltSync(12);
        this.password = bcrypt.hashSync(this.password, salt);
    }
    next();
});

UserSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.statics.register = (props) => {
    const user = new User(props);
    return user.save();
};

const User = mongoose.model('User', UserSchema);

export default User;
