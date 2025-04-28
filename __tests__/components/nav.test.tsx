import { render, screen } from '@testing-library/react'
import { Navbar } from '../../app/components/nav'

describe('Navbar Component', () => {
  it('renders navigation links', () => {
    render(<Navbar />)
    
    // Check if all navigation links are rendered
    expect(screen.getByText('home')).toBeInTheDocument()
    expect(screen.getByText('blog')).toBeInTheDocument()
    expect(screen.getByText('library')).toBeInTheDocument()
    expect(screen.getByText('contact')).toBeInTheDocument()
  })

  it('renders links with correct href attributes', () => {
    render(<Navbar />)
    
    // Check if links have correct href attributes
    expect(screen.getByText('home').closest('a')).toHaveAttribute('href', '/')
    expect(screen.getByText('blog').closest('a')).toHaveAttribute('href', '/blog')
    expect(screen.getByText('library').closest('a')).toHaveAttribute('href', '/library')
    expect(screen.getByText('contact').closest('a')).toHaveAttribute('href', '/contact')
  })
}) 