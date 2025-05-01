"use client"

import { Button } from '@/components/ui/button'
import { accessForCreator } from '@/consts'
import { handleGetMethod } from '@/utils/apiCall'
import Link from 'next/link'
import { useState } from 'react';

export default function UnauthorizedPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleRequestAccess = async() => {
    setLoading(true);
    const response = await handleGetMethod(accessForCreator);
    if(response instanceof Response) {
      const res = await response.json();
      setMessage(res.message);
    } else{
      setMessage("Something went wrong. Please try again later.");
    }
    setLoading(false);
  }
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Unauthorized Access</h1>
      <p className="mb-4">You do not have permission right now.</p>
      <div className='mb-4'>
        {message ?
          <p>{message}</p>
          :
          <Button onClick={handleRequestAccess} disabled={loading} size={"lg"}>
            {loading ? "Loading..." : "Request for Access"}
          </Button>
        }
      </div>
      <Link href="/" className="">
        <Button variant={"outline"}>
          Return to Home
        </Button>
      </Link>
    </div>
  )
}

