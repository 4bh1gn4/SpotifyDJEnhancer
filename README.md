# 🎧 Spotify DJ Enhancer

A full-stack web app that lets you explore, filter, and remix your Spotify playlists based on emotional tone ("valence"). Built with a **React frontend** and a **Flask backend**, this project connects to Spotify’s Web API for a seamless music-enhancing experience.

---

## 🚀 Features

- 🎵 **Log in with Spotify** using OAuth2
- 📂 Fetch and view your playlists
- 🧠 Filter tracks by *valence* (emotion)
- 🎧 Create a new playlist from filtered tracks
- 🔄 Persistent token storage using localStorage
- 🌐 CORS-enabled Flask API for secure frontend-backend interaction

---

## 🧱 Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React                                |
| Backend   | Flask                                |
| Auth      | Spotify OAuth2                       |

---

## 🛠️ Setup Instructions (Local Hosting)

### 📦 1. Clone the Repository

```bash
git clone https://github.com/4bh1gn4/SpotifyDJEnhancer.git
cd SpotifyDJEnhancer
```

---

### 🧪 2. Flask Backend

#### 📁 Navigate to the Flask directory (e.g., `Main/`)

```bash
cd Main
```

#### 🐍 Create virtual environment and install dependencies

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
```

#### ▶️ Run the server

```bash
python application.py
```

---

### ⚛️ 3. React Frontend

#### 📁 Navigate to the React folder

```bash
cd frontend  # adjust if named differently
```

#### 📂 Create `.env` file

```
REACT_APP_API_URL=http://localhost:5000
```

#### 📦 Install dependencies

```bash
npm install
```

#### ▶️ Start the app

```bash
npm start
```

---

## 📁 Repository Structure

```
SpotifyDJEnhancer/
├── Main/                     # Flask API
│   ├── application.py
│   ├── requirements.txt
│   └── Procfile
├── frontend/                # React App
│   ├── src/
│   ├── public/
│   └── .env
└── README.md
```

---

## 🧠 Key Files

| File                | Purpose                               |
|---------------------|---------------------------------------|
| `application.py`    | All Flask endpoints and Spotify auth  |
| `AuthCallback.js`   | Handles Spotify login callback        |
| `PlaylistTracks.js` | Displays and filters tracks by valence|
| `.env`              | React environment variables           |

---

## 🔐 Environment Variables

You must register a Spotify Developer App:  
👉 [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

Backend should contain:
- `CLIENT_ID`
- `CLIENT_SECRET`

---

## 🌩️ Cloud Hosting (In Progress)

I’ve started setting up cloud hosting:

- Flask backend is being deployed on **AWS Elastic Beanstalk**
- React frontend is being hosted on **AWS Amplify**
- CORS configuration and HTTPS redirects are currently being debugged
- Token handling between Amplify and Beanstalk is not fully working yet

Future versions will include:
- Full HTTPS integration with ACM
- Secure OAuth callback handling
- Public launch links

---

## 🙌 Credits

Developed by [@4bh1gn4](https://github.com/4bh1gn4)  
Powered by [Spotify Web API](https://developer.spotify.com)

---

## 📜 License

MIT License
