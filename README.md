Markdown
# On the Go LMS — FOT USJ Mobile Client

A modern, dark-themed mobile client built with **React Native (Expo)** and **TypeScript** for the Faculty of Technology Learning Management System (`lms.tech.sjp.ac.lk`), University of Sri Jayewardenepura. 

Designed to replace slow mobile browser navigation with native speed, secure token persistence, offline lecture downloads, and automated local deadline reminders.

---

## Key Features

- **Dual Authentication:** Sign in seamlessly using your student registration credentials or directly via a generated Moodle REST `wstoken`.
- **Hardware-Encrypted Session Storage:** Persists active tokens and user profiles securely inside iOS Keychain / Android Keystore using `expo-secure-store`.
- **Course & Module Explorer:** View enrolled modules, completion progress bars, and structured course sections via Moodle's Web Service REST API.
- **Native Lecture Downloads:** Download and share PDF slides, lab sheets, and course resources directly to your device using `expo-file-system` and `expo-sharing`.
- **Automated Deadline Reminders:** Automatically syncs upcoming assignment due dates and schedules local push notifications (24 hours and 2 hours prior to submission deadlines) via `expo-notifications`.
- **Modern Dark UI:** Styled natively with **NativeWind (Tailwind CSS)** and **Lucide Icons** for clean readability and low eye strain.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React Native, Expo SDK, TypeScript |
| **Navigation** | React Navigation (Native Stack & Bottom Tabs) |
| **Styling** | NativeWind v4 (Tailwind CSS) |
| **Icons** | `lucide-react-native` & `react-native-svg` |
| **Security & Storage** | `expo-secure-store` |
| **File Handling** | `expo-file-system` & `expo-sharing` |
| **Notifications** | `expo-notifications` |
| **Backend Integration** | Moodle Mobile Web Services REST API (`lms.tech.sjp.ac.lk`) |

---

## Project Structure

```text
sjp-lms-mobile/
├── App.tsx                     # Root navigation & AuthProvider wrapper
├── global.css                  # Tailwind CSS entry point
├── tailwind.config.js          # Custom dark theme & content paths
├── metro.config.js             # Metro bundler config with NativeWind
├── babel.config.js             # Babel preset & Reanimated plugin config
└── src/
    ├── context/
    │   └── AuthContext.tsx     # Global auth state & session restoration
    ├── services/
    │   ├── api.ts              # Moodle REST API client & URL resolvers
    │   ├── storage.ts          # SecureStore token & profile helpers
    │   └── notifications.ts    # OS permission & local reminder scheduler
    └── screens/
        ├── LoginScreen.tsx         # Student ID/Password & wstoken login
        ├── CoursesScreen.tsx       # Enrolled courses dashboard
        ├── CourseDetailScreen.tsx  # Course topics & file downloader
        ├── DeadlinesScreen.tsx     # Sorted assignment tracker & alerts
        └── ProfileScreen.tsx       # Student details & session controls
Getting Started
Prerequisites
Node.js (v18 or newer)

Expo Go app installed on your Android or iOS device

Active student account on https://lms.tech.sjp.ac.lk

Installation
Clone the repository:

Bash
git clone [https://github.com/your-username/sjp-lms-mobile.git](https://github.com/your-username/sjp-lms-mobile.git)
cd sjp-lms-mobile
Install dependencies:

Bash
npm install
Start the Expo development server:

Bash
npx expo start -c
Run on your device:

Scan the QR code displayed in the terminal using Expo Go (Android) or the default Camera app (iOS).

Moodle REST API Endpoints Used
This client communicates directly with /webservice/rest/server.php using moodlewsrestformat=json:

login/token.php — Authenticates student credentials against the moodle_mobile_app service.

core_webservice_get_site_info — Retrieves student userid, full name, and profile avatar.

core_enrol_get_users_courses — Fetches active courses and completion percentages.

core_course_get_contents — Loads course topics, assignments, and authenticated resource URLs.

mod_assign_get_assignments — Fetches assignment deadlines for the task tracker and local notification scheduler.

License
Developed for academic and student utility purposes at the Faculty of Technology, University of Sri Jayewardenepura.


<ElicitationsGroup message="Would you like to add anything else to your repository?">
  <Elicitation label="Add .gitignore file" query="Generate a clean .gitignore file for this Expo React Native TypeScript project."/>
  <Elicitation label="Build standalone APK" query="How do I build a standalone Android APK for this Expo app using EAS Build so I can share it with batchmates?"/>
  <Elicitation label="Add offline course caching" query="How do I add AsyncStorage offline caching so students can view courses without internet?"/>
</ElicitationsGroup>
