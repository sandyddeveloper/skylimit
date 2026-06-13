"use client";

import { useState, useEffect, useRef } from "react";

// ── Config ──
const GITHUB_USERNAME = "sandyddeveloper";
const GITHUB_API = "https://github-contributions-api.deno.dev";

// ── Types ──
export interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string | null;
  company: string | null;
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  totalPRs: number;
  topLanguages: LanguageStat[];
}

export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionDay[][];
}

// ── Static fallback data (used when API is rate-limited) ──
const FALLBACK_PROFILE: GitHubProfile = {
  login: "sandyddeveloper",
  name: "Santhosh Raj K",
  avatar_url: `https://github.com/${GITHUB_USERNAME}.png`,
  bio: "Full Stack Developer | Open Source Enthusiast",
  public_repos: 72,
  followers: 45,
  following: 12,
  html_url: `https://github.com/${GITHUB_USERNAME}`,
  location: "India",
  company: null,
};

const FALLBACK_STATS: GitHubStats = {
  totalStars: 24,
  totalForks: 8,
  totalCommits: 1087,
  totalPRs: 42,
  topLanguages: [
    { name: "Python", bytes: 450000, percentage: 35.2, color: "#3572A5" },
    { name: "JavaScript", bytes: 320000, percentage: 25.0, color: "#f1e05a" },
    { name: "TypeScript", bytes: 200000, percentage: 15.6, color: "#3178c6" },
    { name: "HTML", bytes: 150000, percentage: 11.7, color: "#e34c26" },
    { name: "CSS", bytes: 100000, percentage: 7.8, color: "#563d7c" },
    { name: "Java", bytes: 60000, percentage: 4.7, color: "#b07219" },
  ],
};


// ── Language Colors ──
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Rust: "#dea584",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  SCSS: "#c6538c",
};

function getLangColor(name: string): string {
  return LANG_COLORS[name] || "#94a3b8";
}

// ── API helpers ──
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchAllRepos(username: string) {
  const repos: Array<{
    name: string;
    stargazers_count: number;
    forks_count: number;
    fork: boolean;
    language: string | null;
    languages_url: string;
  }> = [];
  let page = 1;
  const perPage = 100000;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const batch = await fetchJSON<typeof repos>(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );
    repos.push(...batch);
    if (batch.length < perPage) break;
    page++;
  }
  return repos;
}

// ── Cache helpers ──
const CACHE_KEY = `gh_stats_${GITHUB_USERNAME}`;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CachedData {
  ts: number;
  profile: GitHubProfile | null;
  stats: GitHubStats | null;
  contributions: ContributionData | null;
}

function loadCache(): CachedData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedData = JSON.parse(raw);
    if (Date.now() - cached.ts > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cached;
  } catch {
    return null;
  }
}

function saveCache(data: CachedData) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // storage full — ignore
  }
}

// ── Fallback contribution data generator ──
function generateFallbackContributions(): ContributionData {
  const weeks: ContributionDay[][] = [];
  const now = new Date();
  for (let w = 23; w >= 0; w--) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const count = Math.random() > 0.3 ? Math.floor(Math.random() * 8) : 0;
      const level = (count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
      week.push({
        date: date.toISOString().split("T")[0],
        count,
        level,
      });
    }
    weeks.push(week);
  }
  return {
    totalContributions: weeks.flat().reduce((s, d) => s + d.count, 0),
    weeks,
  };
}

// ── Main Hook ──
export function useGitHubStats() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [contributions, setContributions] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    // ── Check cache first ──
    const cached = loadCache();
    if (cached) {
      let prof = cached.profile;
      if (!prof || !prof.login) {
        prof = FALLBACK_PROFILE;
      } else {
        prof = {
          ...prof,
          bio: prof.bio || FALLBACK_PROFILE.bio,
          name: prof.name || FALLBACK_PROFILE.name || prof.login,
        };
      }
      let st = cached.stats;
      if (!st) {
        st = FALLBACK_STATS;
      } else if (!st.topLanguages || st.topLanguages.length === 0) {
        st = {
          ...st,
          topLanguages: FALLBACK_STATS.topLanguages,
        };
      }
      setProfile(prof);
      setStats(st);
      setContributions(cached.contributions || generateFallbackContributions());
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      let fetchedProfile: GitHubProfile | null = null;
      let fetchedStats: GitHubStats | null = null;
      let fetchedContribs: ContributionData | null = null;
      const errors: string[] = [];

      // 1. Contributions (unofficial API — no rate limit, fetch first)
      try {
        const contribData = await fetchJSON<{
          totalContributions: number;
          contributions: Array<Array<{
            date: string;
            contributionCount: number;
            contributionLevel: string;
            color: string;
          }>>;
        }>(`${GITHUB_API}/${GITHUB_USERNAME}.json`);

        const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
          NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2,
          THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
        };

        const allWeeks = contribData.contributions || [];
        const recentWeeks = allWeeks.slice(-24);
        const weeks: ContributionDay[][] = recentWeeks.map((week) =>
          week.map((day) => ({
            date: day.date,
            count: day.contributionCount,
            level: levelMap[day.contributionLevel] ?? 0,
          }))
        );

        fetchedContribs = {
          totalContributions: contribData.totalContributions,
          weeks,
        };
      } catch {
        fetchedContribs = generateFallbackContributions();
      }
      setContributions(fetchedContribs);

      // 2. Profile
      try {
        fetchedProfile = await fetchJSON<GitHubProfile>(
          `https://api.github.com/users/${GITHUB_USERNAME}`
        );
        if (fetchedProfile) {
          fetchedProfile = {
            ...fetchedProfile,
            bio: fetchedProfile.bio || FALLBACK_PROFILE.bio,
            name: fetchedProfile.name || FALLBACK_PROFILE.name || fetchedProfile.login,
          };
        }
      } catch {
        fetchedProfile = FALLBACK_PROFILE;
      }
      setProfile(fetchedProfile);

      // 3. Repos → stars, forks, languages
      let totalStars = 0;
      let totalForks = 0;
      let topLanguages: LanguageStat[] = [];
      let reposFailed = false;

      try {
        const repos = await fetchAllRepos(GITHUB_USERNAME);
        const ownRepos = repos.filter((r) => !r.fork);
        totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
        totalForks = ownRepos.reduce((sum, r) => sum + r.forks_count, 0);

        // Languages from top repos
        const sortedRepos = [...ownRepos]
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 10);

        const langMap: Record<string, number> = {};
        await Promise.all(
          sortedRepos.map(async (repo) => {
            try {
              const langs = await fetchJSON<Record<string, number>>(
                `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/languages`
              );
              for (const [lang, bytes] of Object.entries(langs)) {
                langMap[lang] = (langMap[lang] || 0) + bytes;
              }
            } catch {
              // skip rate-limited repos silently
            }
          })
        );

        const totalBytes = Object.values(langMap).reduce((a, b) => a + b, 0);
        topLanguages = Object.entries(langMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([name, bytes]) => ({
            name,
            bytes,
            percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
            color: getLangColor(name),
          }));
      } catch {
        reposFailed = true;
      }

      // 4. Commits count
      let totalCommits = 0;
      try {
        const commitData = await fetchJSON<{ total_count: number }>(
          `https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}&per_page=1`
        );
        totalCommits = commitData.total_count;
      } catch {
        // search API rate limited separately — skip silently
      }

      // 5. PR count
      let totalPRs = 0;
      try {
        const prData = await fetchJSON<{ total_count: number }>(
          `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr&per_page=1`
        );
        totalPRs = prData.total_count;
      } catch {
        // skip silently
      }

      // Use fallback stats if repos API failed or returned empty languages
      if (reposFailed || topLanguages.length === 0) {
        fetchedStats = {
          totalStars: totalStars || FALLBACK_STATS.totalStars,
          totalForks: totalForks || FALLBACK_STATS.totalForks,
          totalCommits: totalCommits || FALLBACK_STATS.totalCommits,
          totalPRs: totalPRs || FALLBACK_STATS.totalPRs,
          topLanguages: FALLBACK_STATS.topLanguages,
        };
      } else {
        fetchedStats = { totalStars, totalForks, totalCommits, totalPRs, topLanguages };
      }
      setStats(fetchedStats);

      // Cache successful results
      saveCache({
        ts: Date.now(),
        profile: fetchedProfile,
        stats: fetchedStats,
        contributions: fetchedContribs,
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  return { profile, stats, contributions, loading, error };
}

