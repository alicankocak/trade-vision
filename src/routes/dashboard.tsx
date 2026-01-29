import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '../layout/MainLayout'
import Dashboard from '../pages/Dashboard'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  )
}
