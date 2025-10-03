import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create sample projects
  const projects = [
    {
      title: 'MediSync',
      description: 'A comprehensive healthcare management system that integrates patient records, appointment scheduling, and telemedicine features to streamline healthcare delivery.',
      slug: 'medisync',
      thumbnail: '/images/profile.jpg',
      content: '# MediSync\n\nA revolutionary healthcare platform that transforms the way medical practices manage their operations.\n\n## Features\n\n- Patient record management\n- Appointment scheduling\n- Telemedicine integration\n- Real-time notifications\n\n## Tech Stack\n\n- TensorFlow for AI predictions\n- Next.js for the frontend\n- Django for the backend',
      technologies: ['TensorFlow', 'NextJS', 'Django'],
      featured: true,
      category: 'AI/ML',
    },
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration and modern UI',
      slug: 'ecommerce-platform',
      thumbnail: '/images/profile.jpg',
      content: '# E-Commerce Platform\n\nModern, scalable e-commerce solution built with cutting-edge technologies.',
      technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
      githubLink: 'https://github.com/username/ecommerce',
      liveUrl: 'https://my-ecommerce.com',
      featured: true,
      category: 'web',
    },
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio showcasing projects and skills with elegant design',
      slug: 'portfolio-website',
      thumbnail: '/images/profile.jpg',
      technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
      githubLink: 'https://github.com/username/portfolio',
      liveUrl: 'https://my-portfolio.com',
      featured: false,
      category: 'web',
    },
    {
      title: 'AI Chatbot',
      description: 'Intelligent conversational AI powered by GPT for customer support',
      slug: 'ai-chatbot',
      thumbnail: '/images/profile.jpg',
      technologies: ['Python', 'OpenAI', 'FastAPI', 'React'],
      githubLink: 'https://github.com/username/ai-chatbot',
      featured: true,
      category: 'AI/ML',
    },
    {
      title: 'Task Manager App',
      description: 'Productivity app with real-time collaboration and task tracking',
      slug: 'task-manager-app',
      thumbnail: '/images/profile.jpg',
      technologies: ['React Native', 'Firebase', 'TypeScript'],
      featured: false,
      category: 'mobile',
    },
    {
      title: 'Data Analytics Dashboard',
      description: 'Interactive dashboard for visualizing business metrics and KPIs',
      slug: 'analytics-dashboard',
      thumbnail: '/images/profile.jpg',
      technologies: ['Python', 'Pandas', 'Plotly', 'Streamlit'],
      featured: false,
      category: 'data-science',
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  console.log(`✅ ${projects.length} projects created`);
  console.log('✨ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
