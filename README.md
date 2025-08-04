# [didtheyghost.me](https://didtheyghost.me/?utm_source=githubrepoheader) - Job Tracking Platform

A community-driven platform that helps students and job seekers track their internship applications, share interview experiences, and discover tech opportunities.

> **This isn’t a job scraper, or yet another job board.**  
> _Think of it like the Internet Archive — but for job applications._ <br>
> _Built by job applicants, for job applicants._


> [!NOTE]
> We're currently starting with a focus on **tech internship roles in Singapore**, as most of our early users are based there.  
> That said, you're welcome to contribute even if you're applying to roles in other countries or outside of tech.


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

Ensure you're using the correct Node.js version, using [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use # Uses the version specified in .nvmrc
```

Install dependencies using your preferred package manager (`npm`, `yarn`, `pnpm`, `bun`):

```bash
npm ci # For npm - installs exact versions from package-lock.json
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


## Want to Contribute or Share Feedback?

We're community-powered and always eager to hear from you!  
Right now, we're focused on growing our user base and collecting feedback.

You can help by:

- Sharing the site with friends or communities
- Tracking your own job applications
- Sharing your interview or online assessment experiences
- Suggesting features or improvements
- Contributing to design, UX, dev or content improvements  
- Helping verify or improve company and job data  
- Reporting bugs or issues

> [!TIP]
> If you notice missing or incorrect data (e.g. a job location or company name), feel free to reach out directly.  
> For example, if you're adding a job you applied to and the location you're looking for isn't listed 
— like **"Seattle, WA, USA"** — let us know. As long as the job posting clearly mentions **"Seattle, WA, USA"**, we can add it.

Whether you have feedback, want to help, or simply have a question — [contact us directly](https://didtheyghost.me/contact?utm_source=githubrepo&utm_medium=contact)
 

