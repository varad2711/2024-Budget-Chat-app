import { useState } from 'react'
import { Button } from './components/ui/button'
import Header from './ui components/Header'
import Sidebar from './ui components/Sidebar'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from './components/ui/textarea'
import axios from 'axios'

function SendIcon (props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m22 2-7 20-4-9-9-4Z' />
      <path d='M22 2 11 13' />
    </svg>
  )
}

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleSendMessage = async () => {
    if (input.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        text: input,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prevMessages => [...prevMessages, newMessage])
      setInput('')
      try {
        const response = await fetchAIResponse(input)
        const aiMessage = {
          id: messages.length + 2,
          text: response,
          sender: 'AI',
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prevMessages => [...prevMessages, aiMessage])
      } catch (error) {
        console.error('Error fetching AI response:', error)
      }
    }
  }

  const fetchAIResponse = async prompt => {
    try {
      const response = await axios.post('http://localhost:5000/api/prompt', {
        prompt
      })
      return response.data.response
    } catch (error) {
      console.error('Error fetching AI response:', error)
      return 'Error fetching response'
    }
  }

  return (
    <div className='font-container'>
      <Header />
      <div className='my-4 mx-4'>
        <Button variant='outline' onClick={toggleSidebar}>
          Toggle Sidebar
        </Button>
      </div>
      <section className='lg:mx-40 mx-8 min-w-screen min-h-full'>
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
        <div
          className={`mt-4 bg-transparent h-[520px] p-4 flex-1 overflow-auto w-auto rounded-lg transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className='space-y-4'>
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'You' ? 'justify-end' : ''
                }`}
              >
                {message.sender !== 'You' && (
                  <Avatar className='w-8 h-8'>
                    <AvatarImage src='/placeholder-user.jpg' />
                    <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[70%] ${
                    message.sender === 'You'
                      ? 'bg-zinc-950 text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className='text-sm'>{message.text}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === 'You'
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp}
                  </div>
                </div>
                {message.sender === 'You' && (
                  <Avatar className='w-8 h-8'>
                    <AvatarImage src='/placeholder-user.jpg' />
                    <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-row mb-0 items-center space-x-2'>
          <div
            className={`flex my-4 w-full transition-all duration-300 ${
              sidebarOpen ? 'ml-64' : 'ml-0'
            }`}
          >
            <Textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Type your message here'
              className='border-gray-700 border-2 w-full'
            />
            <Button
              onClick={handleSendMessage}
              size='icon'
              variant='ghost'
              className='bg-white hover:bg-slate-300 rounded-md ml-2 flex justify-center align-middle self-center'
            >
              <SendIcon className='mx-2 text-muted-foreground' />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
