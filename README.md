
# Login & Registration Template

This is a template code for login and registration functionality using Google, Facebook, and Email/Password. Google and Facebook authentication is implemented using Auth.js. The project also includes JWT token management for securing routes and user data.

## Features:
- User login and registration using Google, Facebook, and Email/Password.
- Secure route handling using JWT authentication.
- Profile management for users, including handling profile pictures and user details.
- Environment setup for development with necessary configurations.

## Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (Local or Cloud setup, such as MongoDB Atlas)
- **Google Developer Console account** (for Google OAuth)
- **Facebook Developer account** (for Facebook OAuth)

### Steps to Set Up
1. **Fork the repository**  
   First, fork this repository to your GitHub account.

2. **Clone the repository**  
   Clone the forked repository to your local machine.

   ```bash
   git clone https://github.com/your-username/your-repository-name.git
   ```

3. **Install dependencies**  
   Navigate to your project folder and install the necessary dependencies.

   ```bash
   cd your-repository-name
   npm install
   ```

4. **Create the `.env` file**  
   Create a `.env` file in the root of your project with the following format:

   ```env
   PORT=5000
   AUTH_SECRET=your-auth-secret
   JWT_SECRET=your-jwt-secret
   MONGO_URI=your-mongo-db-uri
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   # Facebook Auth credentials
   AUTH_FACEBOOK_ID=your-facebook-app-id
   AUTH_FACEBOOK_SECRET=your-facebook-app-secret
   ```

   Replace the placeholders with your actual values.

5. **Run the project**

   Start the development server with:

   ```bash
   npm run dev
   ```

   Your server will run at `http://localhost:5000`.

6. **Google OAuth Setup**
   - Go to the [Google Developer Console](https://console.developers.google.com/).
   - Create a new project and enable the "Google+ API".
   - Generate OAuth 2.0 credentials (client ID and client secret) and add them to your `.env` file.

7. **Facebook OAuth Setup**
   - Go to the [Facebook Developer Console](https://developers.facebook.com/).
   - Create a new app and generate the App ID and App Secret.
   - Add these credentials to your `.env` file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

