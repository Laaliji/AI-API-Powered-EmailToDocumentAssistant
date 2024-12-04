import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Inbox, Star, Archive, Trash2, Tag, Zap, Search, Moon, Sun } from 'lucide-react'

const emails = [
  {
    id: 1,
    sender: 'Alice Johnson',
    subject: 'Project Update',
    preview: 'Here are the latest updates on the project...',
    category: 'Work',
    isImportant: true,
    timestamp: '10:30 AM'
  },
  {
    id: 2,
    sender: 'Bob Smith',
    subject: 'Lunch Tomorrow?',
    preview: 'Would you like to grab lunch tomorrow at...',
    category: 'Personal',
    isImportant: false,
    timestamp: 'Yesterday'
  },
  {
    id: 3,
    sender: 'Newsletter',
    subject: 'Your Weekly Tech Digest',
    preview: 'Check out the latest in AI and machine learning...',
    category: 'Newsletter',
    isImportant: false,
    timestamp: '2 days ago'
  }
]

export default function IntelligentEmailAgent() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="flex h-screen bg-gray-100 w-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 space-y-4">
        <Button className="w-full">Compose</Button>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Inbox className="mr-2 h-4 w-4" /> Inbox
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Star className="mr-2 h-4 w-4" /> Starred
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Archive className="mr-2 h-4 w-4" /> Archive
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Trash2 className="mr-2 h-4 w-4" /> Trash
          </Button>
        </div>
        <div className="pt-4">
          <h3 className="mb-2 text-sm font-semibold">Smart Categories</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Tag className="mr-2 h-4 w-4" /> Work
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Tag className="mr-2 h-4 w-4" /> Personal
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Tag className="mr-2 h-4 w-4" /> Newsletter
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Intelligent Inbox</h1>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input className="pl-8 w-full" placeholder="Search emails..." />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="ml-2 absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {darkMode ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>

        </div>

        <Card>
          <CardHeader>
            <CardTitle>Smart Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Zap className="mr-2 h-4 w-4" /> Summarize Inbox
            </Button>
            <Button variant="outline" size="sm">
              <Zap className="mr-2 h-4 w-4" /> Generate To-Do List
            </Button>
            <Button variant="outline" size="sm">
              <Zap className="mr-2 h-4 w-4" /> Schedule Follow-ups
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {emails.map((email) => (
            <Card key={email.id}>
              <CardContent className="flex items-center p-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${email.sender}`} />
                  <AvatarFallback>{email.sender[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">{email.sender}</p>
                  <p className="text-sm text-muted-foreground">{email.subject}</p>
                  <p className="text-sm text-muted-foreground">{email.preview}</p>
                </div>
                <div className="ml-auto flex flex-col items-end space-y-1">
                  <Badge variant={email.isImportant ? "destructive" : "secondary"}>
                    {email.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{email.timestamp}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

