import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { VideoCall } from '@/components/VideoCall'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_app/video')({
  component: VideoPage,
})

function VideoPage() {
  const [roomId, setRoomId] = useState('')
  const [role, setRole] = useState<'caller' | 'receiver' | null>(null)
  const [inCall, setInCall] = useState(false)

  // 🔥 generate random room id
  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8)
    setRoomId(id)
  }

  const handleStart = (selectedRole: 'caller' | 'receiver') => {
    if (!roomId.trim()) return
    setRole(selectedRole)
    setInCall(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId)
    alert('Room ID copied!')
  }

  if (inCall && role) {
    return (
      <div className="p-6">
        <VideoCall
          roomId={roomId}
          isInitiator={role === 'caller'}
          onEnd={() => {
            setInCall(false)
            setRole(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-full p-6">
      <h1 className="text-2xl font-bold">Video Call</h1>

      <div className="flex gap-2">
        <Input
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="max-w-sm"
        />

        <Button variant="outline" onClick={generateRoomId}>
          Generate
        </Button>
      </div>

      {roomId && (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCopy}>
            Copy Room ID
          </Button>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          disabled={!roomId}
          onClick={() => handleStart('caller')}
        >
          Start Call
        </Button>

        <Button
          variant="outline"
          disabled={!roomId}
          onClick={() => handleStart('receiver')}
        >
          Join Call
        </Button>
      </div>
    </div>
  )
}