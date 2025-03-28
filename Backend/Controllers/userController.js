import User from "../models/User.js";
import SocialUser from "../models/SocialLogin.js";
import { URL } from "url"; // Using the URL class to handle URL normalization

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    let user = await User.findById(userId);

    if (!user) {
      user = await SocialUser.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ msg: "Server error fetching user by ID." });
  }
};
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(email, "Fetching user by email");
    const user = await SocialUser.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ msg: "Server error fetching user by email." });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const decodedQuery = decodeURIComponent(query);

    console.log("Decoded Query: ", decodedQuery);

    // Normalize the URL by removing unnecessary query parameters for comparison
    const normalizeUrl = (url) => {
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

    const normalizedQuery = normalizeUrl(decodedQuery); // Normalize the query URL
    console.log(normalizedQuery);
    const userSearch = User.find({
      $or: [
        { name: { $regex: normalizedQuery, $options: "i" } },
        { email: { $regex: normalizedQuery, $options: "i" } },
      ],
    }).select("_id name email");

    const socialUserSearch = SocialUser.find({
      $or: [
        { username: { $regex: normalizedQuery, $options: "i" } },
        { email: { $regex: normalizedQuery, $options: "i" } },
        { normalizedProfilePicture: normalizedQuery }, // Search by normalized profile picture URL
      ],
    }).select("_id username email profilePicture token createdAt");

    // Execute both queries in parallel
    const [users, socialUsers] = await Promise.all([
      userSearch,
      socialUserSearch,
    ]);

    // Log the social users found
    console.log("Social Users Found: ", socialUsers);
    // Combine results
    const combinedResults = [
      ...users.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
      })),
      ...socialUsers.map((user) => ({
        _id: user._id,
        name: user.username,
        email: user.email,
        token: user.token,
        createdAt: user.createdAt,
        profilePicture: user.profilePicture,
      })),
    ];

    res.json(combinedResults);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ msg: "Server error searching users." });
  }
};
