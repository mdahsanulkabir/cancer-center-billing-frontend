import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
// import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import PersistLogin from './components/PersistLogin'
import RequireAuth from './components/RequireAuth'
import Unauthorized from './components/Unauthorized'
import CreateInvoice from './pages/CreateInvoice'
import Welcome from './components/Welcome'
import Department from './pages/Department'
import Discount from './pages/Discount'
import Service from './pages/Service'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Outlet />}>
        <Route path="login" element={<Login />} />
        {/* <Route path='unauthorized' element={<Unauthorized />} /> */}

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={["666ed89d56e19049d12ed058", "66716ba18d0af3999eb9926c"]} />}>
            <Route path='/' element={<Home />}>
              <Route index element={<Welcome />} />
              <Route path='unauthorized' element={<Unauthorized />} />
              <Route element={<RequireAuth allowedRoles={["666ed89d56e19049d12ed058"]} />}>
                <Route path='/create-invoice' element={<CreateInvoice />} />
                <Route path='/department' element={<Department />} />
                <Route path='/discount' element={<Discount />} />
                <Route path='/service' element={<Service />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
