const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");

const userSchema = mongoose.Schema({
    name:{type:String , required: true},
    email:{type:String , required: true, unique: true},
    password:{type:String , required: true},   
    pic:{type:String ,default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}, 

},{timestamps:true});


userSchema.methods.matchpassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.password);
}

//before saved the user encrypt the password
userSchema.pre("save",async function(next){  //middleware
    if(!this.isModified){ //if current password is not modified ,moveon to next means dont run code after it
        next()
    }//otherwisw generate password

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);


})

const User=mongoose.model("User",userSchema);

module.exports=User;