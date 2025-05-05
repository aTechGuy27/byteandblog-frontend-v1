import Image from "next/image"

export default function AboutPage() {
  // Skills data
  const skills = [
    { name: "Java", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
    { name: "Spring-Boot", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
    { name: "React", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300" },
    { name: "Next.js", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    { name: "Node.js", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
    { name: "Hibernate", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    { name: "MongoDB", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
    { name: "PostgreSQL", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
    { name: "GraphQL", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300" },
    { name: "AWS", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
    { name: "Kubernetes", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
    { name: "Docker", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
    { name: "CI/CD", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
    
  ]

  // Journey/Experience data
  const experiences = [
    {
      title: "Technology Lead at Infosys(Edgeverve Systems)",
      period: "2022 - Present",
      description: "Leading development of enterprise web applications using React and Node.js.",
    },
    {
      title: "Software Engineer at Enterprise Softlab Pvt.Ltd (Accenture)",
      period: "2020 - 2022",
      description: "Built and maintained multiple web applications from scratch.",
    },
    {
      title: "Computer Science Degree",
      period: "2011 - 2014",
      description: "Graduated with honors, specializing in web technologies.",
    },
  ]

  const projects = [
    {
      porject: "TradeEdge Market Connect",
      client: "Edgeverve System Pvt.Ltd.",
      role: "Technology Lead",
      duration: "Oct 2022 – Present",
      teamSize: "12",
      skillsUsed: "Java, Maven, Spring Boot, Shell Script, PostgreSQL, AWS,Kubernetes",
      overview: "TradeEdge Market Connect is an automated two-way data exchange platform that enables the acquisition of sales, order, inventory, invoice, or similar information from channel partners and delivers it to manufacturers. It scales from emerging markets to modern retailers, using Machine Learning for data quality and anomaly detection.",
      responsibilities: [
        "Lead and manage a team of Tech support engineers for timely resolution of production issues.",
        "Monitor application performance, troubleshoot errors, and optimize system stability.",
        "Handle critical incidents, perform root cause analysis, and implement long-term solutions.",
        "Manage and prioritize issue tickets, ensuring SLA compliance.",
        "Develop and maintain documentation, including troubleshooting guides and knowledge base articles." ,]
    },
    {
      porject: "Connectivity IoT-Telemetry: Container Distribution",
      client: "Dell EMC",
      role: "Software Developer",
      duration: "Apr 2021 – Aug 2022",
      teamSize: "11",
      skillsUsed: "Docker, Kubernetes, Helm, Rancher, Linux, GoLang, Shell Script, Java, Maven, Nginx, Spring Boot, Spring Cloud Gateway, SonarQube, BlackDuck, Checkmarx",
      overview: " Container Distribution is a self-service platform for product engineering groups to manage Docker container orchestration, enabling image/chart upload and download for cloud-enabled products.",
      responsibilities: [
        "Learned Rancher and Kubernetes (RKE) for single-node cluster management.",
         "Implemented GoLang application for Helm custom plugin.",
        "Configured Nginx Gateway for Helm chart pull.",
        "Developed automated application to scan Docker images and share vulnerability reports.," ,   ]
    },
    {
      porject: "Secure Remote Service-IPV6",
      client: "Dell EMC",
      role: "Software Developer",
      duration: "Oct 2020 – Apr 2021",
      teamSize: "29",
      skillsUsed: "Java, Linux (Bash Shell Script), Docker, Apache, Maven, Oracle, PostgreSQL",
      overview: "Migrated Secure Remote Service (SRS) from IPv4 to IPv6 for Facebook, involving SRS Client, Gateway, and Backend components.",
      responsibilities: [
        "Updated IPv4 components for IPv6 migration.",
        "Implemented product scripts using Linux Bash.",
        "Created Docker containers and custom Docker bridge for SRS communication.",
        "Debugged SRS components over IPv6 network.",    ]
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">About Me</h1>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/3">
          <div className="relative w-full aspect-square max-w-[300px] rounded-lg overflow-hidden">
            <Image src="/aboutme.JPG?height=300&width=300" alt="Sunil Kumar" fill className="object-cover" />
          </div>
        </div>

        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">Hello, I'm Sunil Kumar</h2>

          <p className="mb-4">
            I&apos;m a full-stack developer with over 7 years of experience building web applications and digital experiences
            that users love.
          </p>

          <p className="mb-4">
          I craft code like an artist paints — with purpose, structure, and just a hint of flair. As a Java developer and web app builder, I specialize in turning complex problems into clean, elegant solutions. From architecting secure backend systems with Spring Boot to connecting the dots between frontend interfaces and databases, I love breathing life into ideas through technology. Each line of code is a chance to create something meaningful — and that’s what keeps me going.
          </p>

          <p className="mb-4">
            When I'm not coding, you can find me hiking, reading sci-fi novels, or experimenting with new technologies.
          </p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">My Skills</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div key={skill.name} className={`py-2 px-4 rounded-md text-center ${skill.color}`}>
              {skill.name}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">My Journey</h2>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8 border-l-2 border-primary">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
              <h3 className="text-xl font-semibold">{exp.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      <br />
      <br />
      <br />
      <section>
        <h2 className="text-2xl font-bold mb-6">My Projects</h2>

        <div className="space-y-8">
          {projects.map((proj, index) => (
            <div key={index} className="relative pl-8 border-l-2 border-primary">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
              <h3 className="text-xl font-semibold">{proj.porject}</h3>
              <p className="text-sm text-muted-foreground mb-2">{proj.client}</p>
              <p className="text-sm text-muted-foreground mb-2">{proj.role}</p>
              <p className="text-sm text-muted-foreground mb-2">{proj.duration}</p>
              <p className="text-sm text-muted-foreground mb-2">{proj.skillsUsed}</p>
              <p className="text-sm text-muted-foreground mb-2">{proj.overview}</p>
              <p>{proj.responsibilities}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
