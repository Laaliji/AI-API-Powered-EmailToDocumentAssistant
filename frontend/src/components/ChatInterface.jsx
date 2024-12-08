import React, { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Inbox, Star, Archive, Trash2, Tag, Zap, Search, Moon, Sun, 
  Filter, SortDesc, RefreshCw, ListFilter 
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { api_url } from '../constant/global'
import useAxios from '../hooks/useAxios'


const initialEmails = [
  {
    id: 1,
    sender: 'Alice Johnson',
    subject: 'Project Update',
    preview: 'Here are the latest updates on the project...',
    category: 'Work',
    isImportant: true,
    timestamp: '10:30 AM',
    read: false,
    tags: ['Important', 'Project']
  },
  {
    id: 2,
    sender: 'Bob Smith',
    subject: 'Lunch Tomorrow?',
    preview: 'Would you like to grab lunch tomorrow at...',
    category: 'Personal',
    isImportant: false,
    timestamp: 'Yesterday',
    read: false,
    tags: ['Invitation']
  },
  {
    id: 3,
    sender: 'Newsletter',
    subject: 'Your Weekly Tech Digest',
    preview: 'Check out the latest in AI and machine learning...',
    category: 'Newsletter',
    isImportant: false,
    timestamp: '2 days ago',
    read: true,
    tags: ['Tech', 'Weekly']
  },
  {
    id: 4,
    sender: 'Newsletter',
    subject: 'Your Weekly Tech Digest',
    preview: 'Check out the latest in AI and machine learning...',
    category: 'Newsletter',
    isImportant: false,
    timestamp: '2 days ago',
    read: true,
    tags: ['Tech', 'Weekly']
  }
]

export default function IntelligentEmailAgent() {
  const [darkMode, setDarkMode] = useState(false)
  const [emails, setEmails] = useState(initialEmails)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')
  const [sortBy, setSortBy] = useState('timestamp')
  const [selectedEmail, setSelectedEmail] = useState(null)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    getEmails()
  }, [darkMode])

  const getEmails = async () => {
    try {
      const response = await useAxios().get('all_emails')
      setEmails(response.data.data.valid_student_requests)
    } catch (error) {
      console.log("error : ",error)
    }
  }

  const filteredAndSortedEmails = useMemo(() => {
    return emails
      .filter(email => 
        (filter === 'All' || email.category === filter) &&
        (searchTerm === '' || 
          email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.preview.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        switch(sortBy) {
          case 'sender':
            return a.sender.localeCompare(b.sender)
          case 'subject':
            return a.subject.localeCompare(b.subject)
          default:
            return new Date(b.timestamp) - new Date(a.timestamp)
        }
      })
  }, [emails, filter, searchTerm, sortBy])

  const markAsRead = (id) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, read: true } : email
    ))
  }



  return (
    <div className="flex h-screen bg-gray-100 w-screen dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 p-4 space-y-4 border-r dark:border-gray-700">
        <Button className="w-full dark:bg-blue-600 dark:text-white">Compose</Button>
        <div className="space-y-2">
          {['Inbox', 'Starred', 'Archive', 'Trash'].map(folder => (
            <Button key={folder} variant="ghost" className="w-full justify-start">
              {folder === 'Inbox' && <Inbox className="mr-2 h-4 w-4" />}
              {folder === 'Starred' && <Star className="mr-2 h-4 w-4" />}
              {folder === 'Archive' && <Archive className="mr-2 h-4 w-4" />}
              {folder === 'Trash' && <Trash2 className="mr-2 h-4 w-4" />}
              {folder}
            </Button>
          ))}
        </div>
        <div className="pt-4">
          <h3 className="mb-2 text-sm font-semibold">Smart Categories</h3>
          <div className="space-y-2">
            {['Work', 'Personal', 'Newsletter'].map(category => (
              <Button 
                key={category} 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setFilter(category)}
              >
                <Tag className="mr-2 h-4 w-4" /> {category}
              </Button>
            ))}
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setFilter('All')}
            >
              <ListFilter className="mr-2 h-4 w-4" /> All Emails
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold dark:text-white">Intelligent Inbox</h1>
          <div className="relative flex items-center">
            <div className="relative mr-2">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                className="pl-8 w-full dark:bg-gray-700 dark:text-white" 
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="mr-2">
                  <SortDesc className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('timestamp')}>
                  Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('sender')}>
                  Sender
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('subject')}>
                  Subject
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
        </div>

        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Smart Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-2">
            {['Summarize Inbox', 'Generate Internship Certificate', 'Schedule Follow-ups'].map(action => (
              <Button key={action} variant="outline" size="sm" className="dark:border-gray-600 dark:text-white">
                <Zap className="mr-2 h-4 w-4" /> {action}
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4 overflow-y-auto h-[calc(100vh-8rem)]">
  {filteredAndSortedEmails.map((email) => (
    <Card 
      key={email.id} 
      className={`dark:bg-gray-800 ${!email.read ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
    >
      <CardContent className="flex items-center p-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={`https://ui-avatars.com/api/?name=${email.sender}`} />
          <AvatarFallback>{email.sender[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1 flex-1">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium leading-none dark:text-white">
              {email.sender}
            </p>
            <span className="text-xs text-muted-foreground dark:text-gray-400">
              {email.timestamp}
            </span>
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-300">
            {email.subject}
          </p>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            {email.preview}
          </p>
          <div className="flex space-x-2 mt-2">
            {email.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="dark:bg-gray-700 dark:text-white"
              >
                {tag}
              </Badge>
            ))}
            {!email.read && (
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-auto"
                onClick={() => markAsRead(email.id)}
              >
                Mark as Read
              </Button>
            )}
          </div>
        </div>
        <Badge 
          variant={email.isImportant ? "destructive" : "secondary"}
          className="dark:bg-gray-700 dark:text-white"
        >
          {email.category}
        </Badge>
      </CardContent>
    </Card>
  ))}
</div>

      </div>
    </div>
  )
}