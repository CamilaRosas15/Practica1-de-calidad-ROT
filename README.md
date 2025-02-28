# [didtheyghost.me](https://didtheyghost.me/?utm_source=githubrepoheader) - Job Tracking Platform

A community-driven platform that helps students and job seekers track their internship applications, share interview experiences, and discover tech opportunities.

## Why use didtheyghost.me?

See a job listing (e.g., on LinkedIn), apply for it, and haven’t heard back? Use **[didtheyghost.me](https://didtheyghost.me/?utm_source=githubrepob)** to check if others have received replies, interviews, or offers. It helps answer burning questions like:

- **How long does it usually take to hear back from company X?**  
- **Has anyone heard back from this role?**  
- **What are the online assessments/interview rounds like?**  
- **When do company X usually hire?**  
- **And lastly, did they ghost me?**

<img width="95.5%" alt="dtgm home" src="https://github.com/user-attachments/assets/1f5ce3ce-a499-4b9e-ac99-e5a067cd1061" />

<p>
  <img src="https://github.com/user-attachments/assets/42eeca7a-734c-4b26-9da3-f98f882fa7d9" alt="dtgm app" width="46%" />
  <img src="https://github.com/user-attachments/assets/2b65585c-5b17-4eef-b48e-cd2a197e0dd6" alt="dtgm OA" width="49%" />
</p>


## Key Features

### 🎯 Track Applications
- Monitor your job applications across different stages  
- View response timelines and track application status  
- Filter applications by status: Applied, Interviewing, Rejected, Ghosted, or Offered  

### 📝 Interview Insights
- Share and learn from online assessment experiences  
- Access detailed interview experiences by round  
- View interview types (Technical, Behavioral, HR) and LeetCode questions  
- Track company response timelines  

### 💼 Job Discovery
- Browse the latest tech internship roles in Singapore  
- Updated daily with new positions  
- Community-sourced job postings  
- Easy filtering by job type, location, and category  

### 💬 Community Engagement
- Ask questions about specific job postings  
- Engage with other applicants  
- Share interview experiences  
- Help others prepare for interviews  

## Technologies Used
- [Next.js 14](https://nextjs.org/docs/getting-started) – React framework with App Router  
- [HeroUI (Previously NextUI)](https://www.heroui.com/) – Modern UI components  
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS  
- [TypeScript](https://www.typescriptlang.org/) – Type safety  
- [Clerk](https://clerk.com/) – Authentication  
- [Supabase](https://supabase.com/) – Database  
- [SWR](https://swr.vercel.app/) – Data fetching  
- [React Hook Form](https://react-hook-form.com/) – Form state and validation  
- [Zod](https://zod.dev/) – Schema validation and runtime type safety  
- [Upstash](https://upstash.com/) – Rate limiting  
## How to Use

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui-org/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.
