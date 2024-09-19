"use client"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, School, Trophy, User, Edit, Lock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { editPasswordSchema, editProfileSchema } from "@/utils/zod_schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import CircleLoading from "../ui/circleLoading"
import { z } from "zod"
import { useRouter, notFound } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { IUserState, setUserState, userInitialState } from "@/redux/user/userSlice"
import Loading from "@/app/loading"
import { toast } from "sonner"
import { handlePostMethod, handlePutMethod } from "@/utils/apiCall"
import { changePasswordEndpoint, editProfile } from "@/consts"
import { setAuthState } from "@/redux/auth/authSlice"
import Link from "next/link"

const testAttempts = [
  {
    id: 1,
    rank: 45,
    score: 80,
    date: '2022-01-01',
  },
  {
    id: 2,
    rank: 10,
    score: 90,
    date: '2022-01-02',
  },
]

type ModalContent = "edit" | "password"

export default function UserProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ModalContent>("edit")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<IUserState>(userInitialState)
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const editForm = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { name: '', institute: '', mobile: '' },
  })

  const editPasswordForm = useForm({
    resolver: zodResolver(editPasswordSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  })

  useEffect(() => {
    setUserDetail(user);
  }, [userDetail, user])

  if (!userDetail) return <Loading />
  if (!userDetail) {
    return notFound();
  }

  const handleEditSubmit = async (values: z.infer<typeof editProfileSchema>) => {
    setLoading(true)
    const response = await handlePutMethod(editProfile, values)
    if(response instanceof Response){
      const responseData = await response.json()
      if (response.status === 200 || response.status === 201) {
        dispatch(setUserState(responseData.data));
        setUserDetail(responseData.data)
        editForm.reset()
        setIsModalOpen(false)
        toast("Profile updated successfully");
        setError("")
      }
      else if (response.status === 401 || response.status === 403) {
        dispatch(setUserState(userInitialState));
        dispatch(setAuthState(false))
        router.push('/login')
        return;
      }
      else {
        setError(responseData.message);
      }
    } else{
      setError(response.message);
    }
    setLoading(false)
  }

  const handlePasswordChange = async (values: z.infer<typeof editPasswordSchema>) => {
    setLoading(true)
    const response = await handlePostMethod(changePasswordEndpoint, values)
    if(response instanceof Response){
      const responseData = await response.json()
      if (response.status === 200 || response.status === 201) {
        toast("Password updated successfully");
        setIsModalOpen(false)
        setError("")
      } else if (response.status === 401 || response.status === 403) {
        dispatch(setUserState(userInitialState));
        router.push('/login')
      }
      else{
        setError(responseData.message);
        setLoading(false)
      }
    }
    else{
      setError(response.message);
      setLoading(false)
    }
    setLoading(false)
  }
  const openModal = (content: ModalContent) => {
    setModalContent(content)
    setIsModalOpen(true)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32">
                <AvatarImage src={userDetail && userDetail.avatarUrl} alt={userDetail && userDetail.name} />
                <AvatarFallback>{userDetail && userDetail.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col items-start mb-2">
                  <h1 className="text-3xl font-bold mb-2">{userDetail && userDetail.name}</h1>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => openModal("edit")}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Info
                      </Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => openModal("password")} className="mt-2">
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-neutral-950" aria-describedby={undefined}>
                      <DialogHeader>
                        <DialogTitle aria-describedby={undefined}>{modalContent === "edit" ? "Edit Profile" : "Change Password"}</DialogTitle>
                        <DialogDescription>
                          {modalContent === "edit"
                            ? "Make changes to your profile here. Click save when you're done."
                            : "Enter your old password and a new password to change it."}
                        </DialogDescription>
                      </DialogHeader>
                      {modalContent === "edit" ? (
                        <Form {...editForm}>
                          <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                            <FormField
                              control={editForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} required />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={editForm.control}
                              name="mobile"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mobile</FormLabel>
                                  <FormControl>
                                    <Input placeholder="1234567890" {...field} required />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={editForm.control}
                              name="institute"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Institute Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Jolonda University" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {
                              loading ?
                                <Button type="submit" className="w-full" disabled>
                                  <CircleLoading color="bg-neutral-50" />
                                </Button>
                                :
                                <Button type="submit" className="w-full" >
                                  Submit
                                </Button>
                            }
                          </form>
                          {error && (
                            <div className="my-3 text-center text-sm text-red-600">
                              <span>{error}</span>
                            </div>
                          )}
                        </Form>
                      ) : (
                        <Form {...editPasswordForm}>
                          <form onSubmit={editPasswordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                            <FormField
                              control={editPasswordForm.control}
                              name="oldPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Old Password</FormLabel>
                                  <FormControl>
                                    <Input placeholder="isfuh8762e1@" {...field} required />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={editPasswordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <Input placeholder="********" {...field} type="password" required />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={editPasswordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm New Password</FormLabel>
                                  <FormControl>
                                    <Input placeholder="********" {...field} type="password" required />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {
                              loading ?
                                <Button type="submit" className="w-full" disabled>
                                  <CircleLoading color="bg-neutral-50" />
                                </Button>
                                :
                                <Button type="submit" className="w-full">
                                  Change Password
                                </Button>
                            }
                          </form>
                          {error && (
                            <div className="my-3 text-center text-sm text-red-600">
                              <span>{error}</span>
                            </div>
                          )}
                        </Form>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-lg text-muted-foreground mb-4">{userDetail && userDetail.institute}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span>{userDetail && userDetail.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <span>{userDetail && userDetail.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="w-5 h-5 text-muted-foreground" />
                    <span>{userDetail && userDetail.institute}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="attempts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attempts">Test Attempts</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          <TabsContent value="attempts">
            <Card>
              <CardHeader>
                <CardTitle>Test Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                {testAttempts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Attempt</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Rank</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testAttempts.map((attempt) => (
                        <TableRow key={attempt.id}>
                          <TableCell>{attempt.id}</TableCell>
                          <TableCell>{attempt.score}</TableCell>
                          <TableCell>{attempt.rank}</TableCell>
                          <TableCell>{attempt.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No test attempts available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Performance Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="flex flex-col items-center p-6">
                      <Trophy className="w-8 h-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">{Math.max(...testAttempts.map(a => a.score))}</p>
                      <p className="text-sm text-muted-foreground">Highest Score</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col items-center p-6">
                      <User className="w-8 h-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">{Math.min(...testAttempts.map(a => a.rank))}</p>
                      <p className="text-sm text-muted-foreground">Best Rank</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col items-center p-6">
                      <School className="w-8 h-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">{testAttempts.length}</p>
                      <p className="text-sm text-muted-foreground">Total Attempts</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Link href={'/'}>
            <Button size="lg">
              Take New Test
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}