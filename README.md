# Agent Starter React Native (VideoSDK)

A React Native starter template for building real-time conversational AI agents using VideoSDK.

## Features

- **Voice & Video Support:** Real-time audio and video communication.
- **AI Agent Integration:** Interact with an AI agent with real-time responses.
- **Live Transcription:** Display ongoing conversation transcripts.
- **Screen Sharing:** Share your screen during sessions.
- **Device Management:** Switch between audio and video input/output devices.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v22.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [React Native development environment](https://reactnative.dev/docs/set-up-your-environment) (Android Studio for Android, Xcode + CocoaPods for iOS)


## Getting Started

Use the following steps to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/videosdk-live/agent-starter-app-react-native.git
cd agent-starter-react-native
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

For iOS, also install pods:
```bash
cd ios && pod install && cd ..
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory by copying the example:
```bash
cp .env.example .env
```

Update the `.env` file with the following values:

```env
AUTH_TOKEN=your_videosdk_auth_token
AGENT_ID=your_agent_id
MEETING_ID=your_meeting_id (optional)
VERSION_TAG=your_version_tag (optional)
```

> [!TIP]
> You can obtain your `AUTH_TOKEN` from the [VideoSDK Dashboard](https://app.videosdk.live/).

**About `VERSION_TAG`:** Open your agent's **Branches** tab on the dashboard, click the 3 dots beside a branch and select **"See Branch History"**, then copy the tag of the version you want. Leave it empty to use the latest deployed version.

### 4. Start Metro
```bash
npm start
# or
yarn start
```

### 5. Run the app
In a new terminal:
```bash
npm run android
# or
yarn android
```
For iOS:
```bash
npm run ios
# or
yarn ios
```


## Configuration

| Variable | Description | Required |
|----------|------------|----------|
| `AUTH_TOKEN` | VideoSDK authorization token | Yes |
| `AGENT_ID` | ID of the AI agent to connect with | Yes |
| `MEETING_ID` | Meeting ID to join; if empty, a new meeting is created (optional) | No |
| `VERSION_TAG` | Version tag of the AI agent; if empty, the backend dispatches the latest version (optional) | No |

---
<p align="center">
  Built with ❤️ by <a href="https://www.videosdk.live/">VideoSDK</a>
</p>
