import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AboutUsPage() {
  const teamMembers = [
    {
      name: "Prabin Sharma",
      role: "CEO & Founder",
      bio: "Jane has over 2 years of experience in education technology and is passionate about making learning accessible to everyone.",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">About TestMaster</h1>
      
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              At TestMaster, we're committed to revolutionizing the way people prepare for and take tests. Our mission is to provide a cutting-edge, adaptive testing platform that helps individuals achieve their full potential and succeed in their academic and professional pursuits.
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
              Founded in 2024, TestMaster was born out of a desire to make test-taking less stressful and more effective. Our team of educators, technologists, and designers came together with a shared vision: to create a platform that adapts to each user's needs and provides personalized learning experiences.
            </p>
            <p>
              Since our inception, we've helped thousands of students and professionals achieve their goals through our innovative approach to testing and assessment. We continue to evolve and improve our platform, always keeping our users' success at the forefront of everything we do.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index}>
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