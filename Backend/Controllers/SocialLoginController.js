import jwt from "jsonwebtoken";
import SocialUser from "../models/SocialLogin.js";
import { URL } from "url"; // Using the URL class to handle URL normalization

export const googleSignIn = async ({
  user,
  account,
  profile,
  email,
  credentials,
}) => {
  try {
    const googleId = profile.sub;
    let existingUser = await SocialUser.findOne({ googleId });

    if (!existingUser) {
      existingUser = await SocialUser.create({
        email: profile.email,
        username: profile.name,
        googleId,
        profilePicture: profile.picture,
      });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Store the token in the user document
    existingUser.token = token;
    await existingUser.save();

    return true;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    return false;
  }
};

// Normalize the URL by removing unnecessary query parameters for comparison
const normalizeUrl = (url) => {
  console.log("url:", url);
  try {
    const parsedUrl = new URL(url);
    parsedUrl.searchParams.sort(); // Sorting the parameters for consistency
    parsedUrl.searchParams.delete("height"); // Remove unnecessary params
    parsedUrl.searchParams.delete("width");
    parsedUrl.searchParams.delete("ext");
    parsedUrl.searchParams.delete("hash");
    return parsedUrl.origin + parsedUrl.pathname + parsedUrl.search;
  } catch (error) {
    console.error("Invalid URL provided for normalization:", url);
    return url; // Return the original URL if it's invalid
  }
};

export const facebookSignIn = async ({
  user,
  account,
  profile,
  email,
  credentials,
}) => {
  try {
    const facebookId = profile.id;
    let existingUser = await SocialUser.findOne({ facebookId });

    console.log(existingUser);
    if (!existingUser) {
      const profilePictureUrl = profile.picture.data.url;
      const normalizedProfilePicture = normalizeUrl(profilePictureUrl); // Normalize the profile picture URL
      console.log(normalizedProfilePicture, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      // Create the new user with the normalized profile picture URL
      existingUser = await SocialUser.create({
        username: profile.name,
        facebookId,
        profilePicture: profilePictureUrl,
        normalizedProfilePicture: normalizedProfilePicture, // Store the normalized URL
      });
    } else {
      // If user exists, you can also update the normalizedProfilePicture if needed
      const profilePictureUrl = profile.picture.data.url;
      const normalizedProfilePicture = normalizeUrl(profilePictureUrl);
      existingUser.profilePicture = profilePictureUrl;
      existingUser.normalizedProfilePicture = normalizedProfilePicture;
    }

    // Generate a token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Store the token in the user document
    existingUser.token = token;
    await existingUser.save();

    return true;
  } catch (error) {
    console.error("Error during Facebook sign-in:", error);
    return false;
  }
};
