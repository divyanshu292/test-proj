import * as React from 'react'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useProjects } from './Sidebar'
import { useNavigate } from 'react-router-dom'

interface SearchResult {
  id: string;
  name: string;
  type: 'project' | 'thread';
  projectId?: string;
}

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState<boolean>(false)
  const { projects } = useProjects()
  const navigate = useNavigate()

  // Search through projects and threads
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    const term = searchTerm.toLowerCase()
    const results: SearchResult[] = []

    // Search in projects
    projects.forEach(project => {
      if (project.name.toLowerCase().includes(term)) {
        results.push({
          id: project.id,
          name: project.name,
          type: 'project'
        })
      }

      // Search in threads within this project
      project.threads.forEach(thread => {
        if (thread.name.toLowerCase().includes(term)) {
          results.push({
            id: thread.id,
            name: thread.name,
            type: 'thread',
            projectId: project.id
          })
        }
      })
    })

    setSearchResults(results)
  }, [searchTerm, projects])

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'project') {
      // Navigate to project
      navigate(`/`)
    } else if (result.type === 'thread' && result.projectId) {
      // Navigate to thread
      navigate(`/project/${result.projectId}/thread/${result.id}`)
    }
    
    // Clear search and hide results
    setSearchTerm('')
    setShowResults(false)
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search projects & threads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
          className="w-full bg-gray-700 border-gray-600 text-gray-100 pl-8 placeholder:text-gray-400"
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Search Results dropdown */}
      {showResults && searchResults.length > 0 && (
        <div 
          className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
          onMouseLeave={() => setShowResults(false)}
        >
          {searchResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className="p-2 hover:bg-gray-700 cursor-pointer flex items-center text-sm"
              onClick={() => handleResultClick(result)}
            >
              <span className={`mr-2 text-xs px-1.5 py-0.5 rounded-md ${
                result.type === 'project' ? 'bg-purple-900 text-purple-200' : 'bg-gray-700 text-gray-300'
              }`}>
                {result.type === 'project' ? 'Project' : 'Thread'}
              </span>
              <span className="truncate text-gray-200">{result.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar