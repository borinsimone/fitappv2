import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

import WorkoutPlanner from '../pages/Workout/WorkoutPlanner';
import MealPlanner from '../pages/Meal/MealPlanner';
import Account from '../pages/Account/Account';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import Test from '../pages/Test';
import Navbar from '../components/Navbar';
import { AnimatePresence } from 'framer-motion';
import { WorkoutProvider } from '../context/WorkoutContext';
import Loading from '../components/ui/Loading';
import { useGlobalContext } from '../context/GlobalContext';
import WorkoutAssistant from '../pages/Workout/Workout-assistant/WorkoutAssistant';

const AppContent = () => {
  const { isLoading } = useGlobalContext();
  const location = useLocation();
  const showNavbar = location.pathname !== '/workout-assistant';

  return (
    <>
      <AnimatePresence>{showNavbar && <Navbar />}</AnimatePresence>
      <AnimatePresence mode='wait'>{isLoading && <Loading />}</AnimatePresence>
      <Routes>
        <Route
          path='/'
          element={
            <Navigate
              to='/home'
              replace
            />
          }
        />

        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/register'
          element={<Register />}
        />
        <Route
          path='/test'
          element={<Test />}
        />

        {/* 🔐 Pagine protette */}
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/workout-assistant'
          element={
            <ProtectedRoute>
              <WorkoutAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path='/workout-planner'
          element={
            <ProtectedRoute>
              <WorkoutPlanner />
            </ProtectedRoute>
          }
        />
        <Route
          path='/meal-planner'
          element={
            <ProtectedRoute>
              <MealPlanner />
            </ProtectedRoute>
          }
        />
        <Route
          path='/account'
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};
const AppRoutes = () => {
  return (
    <Router basename='/fitappv2'>
      <AuthProvider>
        <WorkoutProvider>
          <AppContent />
        </WorkoutProvider>
      </AuthProvider>
    </Router>
  );
};
export default AppRoutes;
