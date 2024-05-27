/* eslint-disable no-shadow */
/* eslint-disable vars-on-top */
/* eslint-disable no-loop-func */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable default-case */
/* eslint-disable array-callback-return */
import React, { useState, useRef, useEffect } from 'react'
import { Centrifuge } from 'centrifuge'
import ChatBubble from './chat-bubble'
import apiHelper from '../common/apiHelper'
import Send from '../../assets/img/icons/send-icon.svg'
import Close from '../../assets/img/icons/close-button.svg'
import { useContextStore } from '../../context-store'

const chatHistoryUrl = 'chat_history'
const sendMessageUrl = 'send_message'
const getTokenUrl = 'get_token'

const ChatContainer = ({ removeSelection, selectedChat }) => {
  const { userDetails } = useContextStore()
  const mainScrollArea = useRef()
  const chatTxtarea = useRef()

  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const autoGrowTxtarea = (e) => {
    chatTxtarea.current.style.height = '24px'
    chatTxtarea.current.style.height = `${e.currentTarget.scrollHeight}px`
  }

  const resetTxtareaHt = () => {
    chatTxtarea.current.style.height = '24px'
  }

  const filterDataStructure = () => ({
    page_number: 1,
    limit: 100,
    chat_id: selectedChat?.id,
  })

  const scrollToBottom = () => {
    setTimeout(() => {
      if (mainScrollArea.current) {
        mainScrollArea.current.scrollTop = mainScrollArea.current.scrollHeight
      }
    }, 10)
  }

  const fetchHistory = async () => {
    try {
      const res = await apiHelper({
        baseUrl: process.env.BLOCK_ENV_URL_API_BASE_URL,
        subUrl: chatHistoryUrl,
        value: filterDataStructure(),
      })
      if (res) {
        setHistory(
          res?.messages?.map((item) => ({
            role: item?.is_owner ? 'owner' : 'user',
            content: item?.content,
            created_at: item?.created_at,
          })),
        )
        scrollToBottom()
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error)
    }
  }

  useEffect(() => {
    if (selectedChat?.id) {
      fetchHistory()
    }
  }, [selectedChat])

  const fetchToken = async () => {
    try {
      const res = await apiHelper({
        baseUrl: process.env.BLOCK_ENV_URL_API_BASE_URL,
        subUrl: getTokenUrl,
        type: 'get',
      })
      return res?.token
    } catch (error) {
      console.error('Failed to fetch chat history:', error)
    }
  }

  useEffect(async () => {
    // Connect to Centrifugo server
    const token = await fetchToken()
    const client = new Centrifuge(process.env.WS_ENDPOINT, {
      debug: true,
      token,
    })
    client.connect()

    const personalChannel = selectedChat.channel_id
    const sub = client
      .newSubscription(personalChannel)
      .on('publication', async (ctx) => {
        console.log('received publication from a channel', ctx.data)
        await fetchHistory()
      })
    sub.subscribe()

    // Clean up the subscription on component unmount
    return () => {
      sub.unsubscribe()
      client.disconnect()
    }
  }, [])

  const sendMessageFilterDataStructure = () => ({
    message,
    senderId: userDetails?.user_id,
    receiverId: selectedChat?.receiver_id,
  })

  const handleClick = async () => {
    setMessage('')
    resetTxtareaHt()
    setLoading(true)
    try {
      await apiHelper({
        baseUrl: process.env.BLOCK_ENV_URL_API_BASE_URL,
        subUrl: sendMessageUrl,
        value: sendMessageFilterDataStructure(),
      })
      fetchHistory()
    } catch (error) {
      console.error('Failed to send message:', error)
    }
    setLoading(false)
  }

  return (
    <form
      className="w-full flex-grow flex flex-col max-h-full overflow-clip bg-[#FCFCFC]"
      onSubmit={(e) => {
        e.preventDefault()
        handleClick()
      }}
    >
      <div className="flex justify-between bg-primary p-4 text-white text-2xl">
        <div>{selectedChat?.chat_name}</div>
        <img
          className="cursor-pointer"
          src={Close}
          width={40}
          alt="close button"
          onClick={removeSelection}
        />
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <div className="flex flex-col h-full">
          <div
            className="custom-scroll-bar overflow-y-auto flex flex-col gap-5 py-4 px-7 h-full flex-grow"
            ref={mainScrollArea}
          >
            {history?.map((msg, idx) => (
              <ChatBubble
                key={idx}
                message={msg}
                isUser={msg.role === 'user'}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex sticky bottom-0 w-full px-4 pb-4 bg-[#FCFCFC]">
        <div className="w-full relative">
          <div className="flex rounded w-full h-full border bg-white px-4 py-3 pr-16 text-base border-[#E5E5E5] focus-within:border-primary">
            <textarea
              ref={chatTxtarea}
              aria-label="chat input"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                autoGrowTxtarea(e)
              }}
              placeholder="Ask anything"
              className="w-full focus:outline-none resize-none text-[15px] max-h-[60px] overflow-y-auto"
              style={{ height: '24px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleClick()
                }
              }}
            />
          </div>
          <button
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-primary/5 focus:bg-primary/10 p-2 rounded-full"
            type="submit"
            aria-label="Send"
            disabled={!message || loading}
          >
            <img className="max-w-[48px]" src={Send} alt="Send" />
          </button>
        </div>
      </div>
    </form>
  )
}

export default ChatContainer
