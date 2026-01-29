import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '../layout/MainLayout'
import Profile from '../pages/Profile'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <MainLayout>
      <Profile />
    </MainLayout>
  )
}
