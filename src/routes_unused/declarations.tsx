import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '../layout/MainLayout'
import DeclarationList from '../pages/DeclarationList'

export const Route = createFileRoute('/declarations')({
  component: DeclarationsPage,
})

function DeclarationsPage() {
  return (
    <MainLayout>
      <DeclarationList />
    </MainLayout>
  )
}
