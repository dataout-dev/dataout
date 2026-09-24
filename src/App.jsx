import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Community from './pages/Community'
import Competition from './pages/Competition'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Layout from './components/Layout'
import Lesson from './pages/Lesson'
import ExamPage from './pages/ExamPage'
import SqlMainPage from './pages/SqlMainPage'
import PlaygroundHome from './pages/PlaygroundHome'
import ExerciseHome from './pages/ExerciseHome'
import ExercisePage from './pages/ExercisePage'
import ProtectedRoute from './components/ProtectedRoute'
import PostLoginRedirect from './components/PostLoginRedirect'

const Playground = lazy(() => import('./pages/Playground'))

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
    <BrowserRouter>
      <PostLoginRedirect />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:lessonType" element={<ProtectedRoute><SqlMainPage /></ProtectedRoute>}/>
          <Route path="/learn/sql/exam/:tier" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
          <Route path='/learn/:lessonType/:lessonId' element={<ProtectedRoute><Lesson /></ProtectedRoute>}/>
          <Route path="/exercise" element={<ExerciseHome />} />
          <Route path="/exercise/:subject" element={<ProtectedRoute><ExercisePage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/playground" element={<PlaygroundHome />} />
          <Route
            path="/playground/sql"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the playground...</p>}>
                  <Playground />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App