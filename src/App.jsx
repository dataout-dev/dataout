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
import SqlProject from './pages/SqlProject'
import SqlMainPage from './pages/SqlMainPage'
import PlaygroundHome from './pages/PlaygroundHome'
import ExerciseHome from './pages/ExerciseHome'
import ExercisePage from './pages/ExercisePage'
import ProtectedRoute from './components/ProtectedRoute'
import PostLoginRedirect from './components/PostLoginRedirect'

const Subscribe = lazy(() => import('./pages/Subscribe'))
const Playground = lazy(() => import('./pages/Playground'))
const PythonPlayground = lazy(() => import('./pages/PythonPlayground'))
const PythonPath = lazy(() => import('./pages/python/PythonPath'))
const PythonLesson = lazy(() => import('./pages/python/PythonLesson'))
const PythonExam = lazy(() => import('./pages/python/PythonExam'))
const GitPath = lazy(() => import('./pages/git/GitPath'))
const GitLesson = lazy(() => import('./pages/git/GitLesson'))
const GitExam = lazy(() => import('./pages/git/GitExam'))
const StatsPath = lazy(() => import('./pages/stats/StatsPath'))
const StatsLesson = lazy(() => import('./pages/stats/StatsLesson'))
const StatsExam = lazy(() => import('./pages/stats/StatsExam'))
const EdaPath = lazy(() => import('./pages/eda/EdaPath'))
const EdaLesson = lazy(() => import('./pages/eda/EdaLesson'))
const EdaProject = lazy(() => import('./pages/eda/EdaProject'))
const MlPath = lazy(() => import('./pages/ml/MlPath'))
const MlLesson = lazy(() => import('./pages/ml/MlLesson'))
const MlProject = lazy(() => import('./pages/ml/MlProject'))

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
          <Route path="/learn/sql/project/:projectId" element={<ProtectedRoute><SqlProject /></ProtectedRoute>} />
          <Route path='/learn/:lessonType/:lessonId' element={<ProtectedRoute><Lesson /></ProtectedRoute>}/>
          <Route path="/exercise" element={<ExerciseHome />} />
          <Route path="/exercise/:subject" element={<ProtectedRoute><ExercisePage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/subscribe"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading...</p>}>
                  <Subscribe />
                </Suspense>
              </ProtectedRoute>
            }
          />
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
          <Route
            path="/playground/python"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the playground...</p>}>
                  <PythonPlayground />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/python"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the Python path...</p>}>
                  <PythonPath />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/python/exam/:tier"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the exam...</p>}>
                  <PythonExam />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/python/:lessonId"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the lesson...</p>}>
                  <PythonLesson />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/git"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the Git path...</p>}>
                  <GitPath />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/git/exam/:tier"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the exam...</p>}>
                  <GitExam />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/git/:lessonId"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the lesson...</p>}>
                  <GitLesson />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/stats"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the Statistics path...</p>}>
                  <StatsPath />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/stats/exam/:tier"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the exam...</p>}>
                  <StatsExam />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/stats/:lessonId"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the lesson...</p>}>
                  <StatsLesson />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/eda"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the EDA path...</p>}>
                  <EdaPath />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/eda/project/:projectId"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the project...</p>}>
                  <EdaProject />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/eda/:lessonId"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the lesson...</p>}>
                  <EdaLesson />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/ml"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the Predictive Modeling path...</p>}>
                  <MlPath />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/ml/project/:projectId"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the project...</p>}>
                  <MlProject />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/ml/:lessonId"
            element={
              <ProtectedRoute>
                <Suspense fallback={<p className="px-8 py-10 text-sm text-caption">Loading the lesson...</p>}>
                  <MlLesson />
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