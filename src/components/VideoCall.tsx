import { useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'

interface Props {
  roomId: string
  isInitiator: boolean
  onEnd: () => void
}

export function VideoCall({ roomId, isInitiator, onEnd }: Props) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState('Starting...')

  useEffect(() => {
    let peer: Peer
    let localStream: MediaStream
    const channel = supabase.channel(`room-${roomId}`)

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localStream = stream
      if (localVideoRef.current) localVideoRef.current.srcObject = stream

      // Create peer with random ID
      peer = new Peer()

      peer.on('open', (myId) => {
        console.log('My ID:', myId)
        setStatus('Waiting for other person...')

        channel.subscribe((status) => {
          if (status !== 'SUBSCRIBED') return

          if (isInitiator) {
            // Caller: broadcast my ID and wait for receiver's ID
            channel.send({
              type: 'broadcast',
              event: 'join',
              payload: { id: myId, role: 'caller' },
            })

            // When receiver joins, call them
            channel.on('broadcast', { event: 'join' }, ({ payload }) => {
              if (payload.role === 'receiver') {
                console.log('Calling receiver:', payload.id)
                setStatus('Calling...')
                const call = peer.call(payload.id, stream)
                call.on('stream', (remoteStream) => {
                  if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
                  setStatus('Connected! ✅')
                })
                call.on('error', (err) => setStatus(`Call error: ${err}`))
              }
            })
          } else {
            // Receiver: listen for caller's ID first, then broadcast mine
            channel.on('broadcast', { event: 'join' }, ({ payload }) => {
              if (payload.role === 'caller') {
                console.log('Caller found:', payload.id)
                // Send my ID back
                channel.send({
                  type: 'broadcast',
                  event: 'join',
                  payload: { id: myId, role: 'receiver' },
                })
              }
            })

            // Also broadcast immediately in case caller is already waiting
            setTimeout(() => {
              channel.send({
                type: 'broadcast',
                event: 'join',
                payload: { id: myId, role: 'receiver' },
              })
            }, 1000)

            // Answer incoming calls
            peer.on('call', (call) => {
              setStatus('Answering...')
              call.answer(stream)
              call.on('stream', (remoteStream) => {
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
                setStatus('Connected! ✅')
              })
            })
          }
        })
      })

      peer.on('error', (err) => {
        console.log('Peer error:', err.type, err)
        setStatus(`Error: ${err.type}`)
      })
    })

    return () => {
      peer?.destroy()
      localStream?.getTracks().forEach((t) => t.stop())
      supabase.removeChannel(channel)
    }
  }, [roomId, isInitiator])

  return (
    <div className="flex flex-col gap-4 items-center">
      <p className="text-sm text-muted-foreground">Status: {status}</p>
      <div className="flex gap-4 w-full">
        <div className="relative w-1/2">
          <video ref={localVideoRef} autoPlay muted className="w-full rounded-xl border" />
          <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
            You
          </span>
        </div>
        <div className="relative w-1/2">
          <video ref={remoteVideoRef} autoPlay className="w-full rounded-xl border" />
          <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
            Peer
          </span>
        </div>
      </div>
      <Button variant="destructive" onClick={onEnd}>
        End Call
      </Button>
    </div>
  )
}