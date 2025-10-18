# Gemini AI Course Recommendations Integration

This guide explains how to set up and test the Gemini AI course recommendation feature in the Help Study Abroad backend.

---

## **1. Overview**

The backend provides a `/api/recommendations` endpoint that returns course recommendations based on user preferences:

- **topics**: Array of topics (e.g., `["AI", "Python"]`)
- **skillLevel**: Beginner, Intermediate, or Advanced

By default, the endpoint returns **mock recommendations**. You can enable **real Gemini AI integration** using a Google Cloud service account.

---

## **2. Setting Up Gemini AI Integration**

### **Step 1: Google Cloud Project**

1. Create a Google Cloud account (free tier available).  
2. Create a new project in the Google Cloud Console.  
3. Enable the **Generative AI API** for the project.

---

### **Step 2: Create a Service Account**

1. Go to **IAM & Admin → Service Accounts**.  
2. Click **Create Service Account** and give it a name.  
3. Assign the role: **AI Platform User** (`roles/aiplatform.user`) or **Editor**.  
4. Finish creating the account and **download the JSON key**.

> Keep this key private. Do **not** include the real JSON in submissions.

---

### **Step 3: Add the JSON Key to the Backend**

1. Place your JSON key in the `backend` folder:  


2. Make sure `recommendations.js` points to it:

```js
const auth = new GoogleAuth({
keyFile: '../../Gemini_Key.json', // path to JSON key from recommendations.js
scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

