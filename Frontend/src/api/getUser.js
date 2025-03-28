import { jwtDecode } from "jwt-decode";

// Function to get user from MongoDB based on token
const getUserFromToken = async (token) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    // Decode the JWT token to get the userId
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    // If userId is valid, fetch user data from MongoDB
    if (userId) {
      const response = await fetch(
        `http://localhost:5000/user/userid/${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      if (userData.password) {
        delete userData.password; // Remove password for security
      }

      return userData;
    } else {
      throw new Error("Invalid token");
    }
  } catch (error) {
    console.error("Error in getUserFromToken:", error);
    return null;
  }
};

const getUser = async () => {
  try {
    // First, check if there's a session from social auth (Google/Facebook)
    const authSessionResponse = await fetch(
      "http://localhost:5000/auth/google/session",
      {
        method: "GET",
        credentials: "include",
      }
    );

    // If a valid session is found
    if (authSessionResponse.ok) {
      const session = await authSessionResponse.json();
      if (session?.user) {
        if (session?.user?.email) {
          const response = await fetch(
            `http://localhost:5000/user/email/${session.user.email}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await response.json();

          if (userData.password) {
            delete userData.password;
          }
          if (userData.token) {
            localStorage.setItem("token", userData.token);
          }

          return userData;
        } else {
          const imageUrl = session.user.image;
          const encodedImageUrl = encodeURIComponent(imageUrl);

          const response2 = await fetch(
            `http://localhost:5000/user/search?query=${encodedImageUrl}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response2.ok) {
            throw new Error("Failed to fetch user data");
          }

          if (response2.ok) {
            const socialUserData = await response2.json();
            console.log(socialUserData);
            if (socialUserData[0].token) {
              localStorage.setItem("token", socialUserData[0].token);
            }
            return socialUserData[0];
          }
        }
      }
    }

    // If no social auth session, try to use JWT token for authentication
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return null;
    }

    // Fetch user based on the JWT token
    const userData = await getUserFromToken(token);
    return userData;
  } catch (error) {
    console.error("Error in getUser:", error);
    window.location.href = "/login";
    return null;
  }
};

export default getUser;
