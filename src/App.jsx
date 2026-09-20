import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Community from './pages/Community'
import Competition from './pages/Competition'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Daily from './pages/Daily'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Layout from './components/Layout'
import Lesson from './pages/Lesson'
import SqlMainPage from './pages/SqlMainPage'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:lessonType" element={<ProtectedRoute><SqlMainPage /></ProtectedRoute>}/>
          <Route path='/learn/:lessonType/:lessonId' element={<ProtectedRoute><Lesson /></ProtectedRoute>}/>
          {/* <Route path="/daily" element={<Daily />} /> */}
          {/* <Route path="/community" element={<Community />} /> */}
          {/* <Route path="/competition" element={<Competition />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App