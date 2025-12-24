import { Route, Routes } from "react-router"
import HomePage from "@/routes/index"

export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
    </Routes>
  )
}