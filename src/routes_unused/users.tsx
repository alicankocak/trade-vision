import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '../layout/MainLayout'
import Users from '../pages/Users'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <MainLayout>
      <Users />
    </MainLayout>
  )
}
