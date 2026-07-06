const express = require("express");
const router = express.Router();

const Profile = require("../models/profileModel");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");


router
.get("/getProfile/:user_id", async (req, res) => {
    try {
        const profile = await Profile.getProfileByUserId(req.params.user_id);
        res.json(profile);
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
})


.post(
    "/saveProfile",
    upload.single("profile_picture"),
    async (req,res)=>{

    try {

        let imageURL = req.body.profile_picture || "";

        if(req.file){

            const result = await new Promise((resolve,reject)=>{

                cloudinary.uploader.upload_stream(
                    {
                        folder:"blackcurrant_profiles",
                        resource_type:"image"
                    },

                    (error,result)=>{

                        if(error){
                            reject(error);
                        }
                        else{
                            resolve(result);
                        }

                    }

                ).end(req.file.buffer);

            });


            imageURL = result.secure_url;
        }



        const profile = await Profile.createOrUpdateProfile({

            user_id:req.body.user_id,

            profile_picture:imageURL,

            profile_bio:req.body.profile_bio

        });


        res.json(profile);


    } catch(err){

        console.error(err);

        res.status(500).json({
            message:err.message
        });

    }

});


module.exports = router;