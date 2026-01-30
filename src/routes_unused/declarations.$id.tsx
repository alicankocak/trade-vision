import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '../layout/MainLayout'
import DeclarationDetail from '../pages/DeclarationDetail'

export const Route = createFileRoute('/declarations/$id')({
  component: DeclarationDetailPage,
})

function DeclarationDetailPage() {
  return (
    <MainLayout>
      <DeclarationDetail />
    </MainLayout>
  )
}
