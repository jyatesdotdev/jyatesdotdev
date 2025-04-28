import { render, screen } from '@testing-library/react'
import Footer from '../../app/components/footer'

describe('Footer Component', () => {
  it('renders all links correctly', () => {
    render(<Footer />)
    
    // Check if links are rendered with correct text
    expect(screen.getByText('rss')).toBeInTheDocument()
    expect(screen.getByText('github')).toBeInTheDocument()
    expect(screen.getByText('linkedin')).toBeInTheDocument()
    expect(screen.getByText('view source')).toBeInTheDocument()
  })

  it('has links with correct href attributes', () => {
    render(<Footer />)
    
    // Check correct href values
    expect(screen.getByText('rss').closest('a')).toHaveAttribute('href', '/rss')
    expect(screen.getByText('github').closest('a')).toHaveAttribute('href', 'https://github.com/jyates89')
    expect(screen.getByText('linkedin').closest('a')).toHaveAttribute('href', 'https://www.linkedin.com/in/jyates-dev/')
    expect(screen.getByText('view source').closest('a')).toHaveAttribute('href', 'https://github.com/jyates89/portfolio')
  })

  it('renders copyright text with current year', () => {
    render(<Footer />)
    
    const currentYear = new Date().getFullYear().toString()
    expect(screen.getByText(`© ${currentYear} MIT Licensed`)).toBeInTheDocument()
  })
}) 