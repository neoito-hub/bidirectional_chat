/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import apiHelper from '../common/apiHelper'
import { useContextStore } from '../../context-store'

const listContactUrl = 'list_contact'
const sendMessageUrl = 'send_message'

const CreateNewChatModal = ({ isOpen, onClose, onSuccess }) => {
  const { userDetails } = useContextStore()

  const [formData, setFormData] = useState({
    message: '',
    senderId: userDetails?.user_id,
    receiverId: null,
  })
  const [errors, setErrors] = useState({})
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)

  const filterDataStructure = () => ({
    page_number: 1,
    limit: 100,
    search: '',
  })

  useEffect(() => {
    let isMounted = true

    const fetchContacts = async () => {
      try {
        const res = await apiHelper({
          baseUrl: process.env.BLOCK_ENV_URL_API_BASE_URL,
          subUrl: listContactUrl,
          value: filterDataStructure(),
        })
        if (isMounted && res) {
          setContacts(
            res?.contacts?.map((item) => ({
              id: item?.id,
              value: item?.name,
              label: item?.name,
            })),
          )
        }
      } catch (error) {
        console.error('Error fetching contacts:', error)
      }
    }

    if (isOpen) {
      fetchContacts()
    }

    return () => {
      isMounted = false
    }
  }, [isOpen])

  const validateForm = () => {
    let formValid = true
    const newErrors = {}

    if (!formData.message) {
      newErrors.message = 'Message is required'
      formValid = false
    }

    if (!formData.receiverId) {
      newErrors.receiverId = 'Select a contact'
      formValid = false
    }

    setErrors(newErrors)
    setTimeout(() => {
      setErrors({})
    }, 3000)
    return formValid
  }

  const handleReactSelectChange = (e, idName) => {
    const { id } = e
    setFormData((prevData) => ({
      ...prevData,
      [idName]: id,
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await apiHelper({
          baseUrl: process.env.BLOCK_ENV_URL_API_BASE_URL,
          subUrl: sendMessageUrl,
          value: formData,
        })
        onSuccess()
        onClose()
      } catch (error) {
        console.error('Error starting new chat:', error)
      }
    }
  }

  if (!isOpen) return null

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '100%',
      border: state.isFocused
        ? '1px solid #63b3ed'
        : `1px solid ${state.isDisabled ? '#e2e8f0' : '#a0aec0'}`,
      borderRadius: '0.375rem',
      backgroundColor: '#ffffff',
      fontSize: '0.875rem',
      color: '#1a202c',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      '&:hover': {
        borderColor: '#a0aec0',
      },
    }),
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" />
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full flex flex-col">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Select a contact to send message
                </h3>
                <div className="flex flex-col float-left mb-4 w-full mt-2">
                  <label className="text-ab-sm float-left mb-2 font-medium text-black">
                    Select Contact
                  </label>
                  <Select
                    name="receiverId"
                    classNamePrefix="react-select"
                    styles={customStyles}
                    value={selectedContact}
                    onChange={(e) => {
                      setSelectedContact(e)
                      handleReactSelectChange(e, 'receiverId')
                    }}
                    options={contacts}
                  />
                  <p className="text-xs text-ab-red left-0 mt-0.5">
                    {errors.receiverId}
                  </p>
                </div>
                <div className="flex flex-col float-left mb-4 w-full">
                  <label className="text-ab-sm float-left mb-2 font-medium text-black">
                    Message
                  </label>
                  <input
                    value={formData.message}
                    name="message"
                    onChange={handleChange}
                    placeholder="Type.."
                    type="text"
                    className={`${
                      errors.message
                        ? 'border-ab-red'
                        : 'border-ab-gray-light focus:border-primary'
                    } text-ab-sm bg-ab-gray-light float-left w-full rounded-md border py-3 px-4 focus:outline-none`}
                  />
                  <p className="text-xs text-ab-red left-0 mt-0.5">
                    {errors.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 mb-5 sm:px-6 sm:flex sm:flex-row-reverse mt-10">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Send
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNewChatModal
