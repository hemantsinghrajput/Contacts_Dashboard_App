# 📱 Contacts Dashboard App

A beautifully designed React Native (Expo) application that displays a list of contacts, allows users to view contact details, mark contacts as favorites, and export favorite contacts as a JSON file.

---

## 🚀 Features

- 📋 Fetches random user contacts from the [Random User API](https://randomuser.me/)
- 🔍 View detailed information about each contact
- ❤️ Mark/unmark contacts as favorites
- 🗂 View all your favorite contacts in one place
- 📤 Export favorite contacts as a JSON file
- 📱 Fully responsive design with smooth animations
- 🧠 Persistent storage using `AsyncStorage`

---

## 📦 Tech Stack

- **React Native (Expo)**
- **TypeScript**
- **React Navigation**
- **AsyncStorage** (via `@react-native-async-storage/async-storage`)
- **Expo FileSystem**
- **Custom utility modules** (`storage`, `timestampTracker`, etc.)

---

## 🛠 Installation

### Prerequisites

- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- Android Studio or Xcode for simulators (or use Expo Go app)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/contacts-dashboard-app.git
cd contacts-dashboard-app

# Install dependencies
npm install

# Start Expo server
npx expo start
