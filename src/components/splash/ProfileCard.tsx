"use client";

import { GitHubProfile } from "@/hooks/use-github-stats";

interface ProfileCardProps {
  profile: GitHubProfile | null;
  loading: boolean;
}

export function ProfileCard({ profile, loading }: ProfileCardProps) {
  if (loading || !profile) {
    return (
      <div className="sd-profile sd-profile-skeleton">
        <div className="sd-avatar-skeleton" />
        <div className="sd-profile-info">
          <div className="sd-skeleton-line sd-skeleton-name" />
          <div className="sd-skeleton-line sd-skeleton-bio" />
          <div className="sd-skeleton-line sd-skeleton-meta" />
        </div>
      </div>
    );
  }

  return (
    <div className={`sd-profile ${loading ? "sd-profile-skeleton" : "sd-profile-in"}`}>
      <img
        src={profile.avatar_url}
        alt={profile.name || profile.login}
        className="sd-avatar"
        width={72}
        height={72}
      />
      <div className="sd-profile-info">
        <h2 className="sd-profile-name">{profile.name || profile.login}</h2>
        {profile.bio && <p className="sd-profile-bio">{profile.bio}</p>}
        <div className="sd-profile-meta">
          <span className="sd-profile-meta-item">
            <span className="sd-meta-num">{profile.followers}</span> followers
          </span>
          <span className="sd-profile-meta-dot">·</span>
          <span className="sd-profile-meta-item">
            <span className="sd-meta-num">{profile.following}</span> following
          </span>
          {profile.location && (
            <>
              <span className="sd-profile-meta-dot">·</span>
              <span className="sd-profile-meta-item sd-meta-loc">
                📍 {profile.location}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
