import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AboutUsPage() {
  const teamMembers = [
    {
      name: "Prabin Sharma",
      role: "Software Engineer",
      bio: "As a developer who navigated the competitive placement landscape, Prabin founded AptiCode to solve the problems he faced. He is dedicated to building tools that genuinely help students and professionals achieve their career ambitions in the tech world.",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">About AptiCode</h1>

      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              To empower every developer with a single, intelligent platform to master coding, conquer aptitude tests, and succeed in their career goals. We are committed to making placement preparation seamless, effective, and accessible to all.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              AptiCode was born from a common frustration. As students and developers, we juggled countless platforms for coding practice, aptitude tests, and interview prep. The learning process was fragmented, inefficient, and often overwhelming. We knew there had to be a better way.
            </p>
            <p>
              We envisioned a single, unified platform where aspiring developers could find everything they need to succeed. A place to practice coding on a mobile-friendly editor, sharpen aptitude skills with a vast question bank, and get AI-powered feedback to improve—all in one place. That vision became AptiCode.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index+1} className="hover:cursor-pointer" onClick={() => window.open("https://prabin.apticode.in", "_blank")}>
              <CardHeader>
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-center">{member.name}</CardTitle>
                <CardDescription className="text-center">{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}