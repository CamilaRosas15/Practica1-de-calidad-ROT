import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import { siteConfig } from "@/config/site";

type GitHubRepoData = {
  stargazers_count: number;
};

export function useGithubStars() {
  const repoPath = siteConfig.githubRepoUrl.replace("https://github.com/", "");

  const { data, isLoading, error } = useSWR<GitHubRepoData>(`https://api.github.com/repos/${repoPath}`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 60000 * 10, // 10 minutes
  });

  return {
    githubStars: data?.stargazers_count ?? 0,
    isLoading,
    error,
  };
}
