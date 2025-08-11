import React, { useState } from "react";
import axios from "axios";
import "./style.css";

export default function App() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRepoData = async () => {
    setError("");
    setData(null);

    if (!owner || !repo) {
      setError("Please enter both owner and repo name.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/repo/${owner}/${repo}`);
      setData(res.data);
    } catch (err) {
      setError("Failed to fetch repository data. Please check owner and repo.");
    } finally {
      setLoading(false);
    }
  };

  // Convert languages object to array sorted by bytes
  const renderLanguages = (languages) => {
    if (!languages) return null;
    const entries = Object.entries(languages);
    const total = entries.reduce((acc, [, bytes]) => acc + bytes, 0);
    return entries
      .sort((a, b) => b[1] - a[1])
      .map(([lang, bytes]) => {
        const percent = ((bytes / total) * 100).toFixed(1);
        return (
          <div key={lang} style={{ marginBottom: 4 }}>
            {lang}: {percent}%
          </div>
        );
      });
  };

  return (
    <div className="container">
      <h1>GitHub Repo History & Activity Viewer</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Owner (e.g. facebook)"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          style={{ marginRight: 10, padding: 8, width: 200 }}
        />
        <input
          type="text"
          placeholder="Repo (e.g. react)"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          style={{ marginRight: 10, padding: 8, width: 200 }}
        />
        <button onClick={fetchRepoData} style={{ padding: "8px 16px" }}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <>
          {/* Repo info */}
          <div style={{ border: "1px solid #ccc", padding: 15, borderRadius: 5, marginBottom: 20 }}>
            <h2>
              <a href={data.repo.html_url} target="_blank" rel="noopener noreferrer">
                {data.repo.full_name}
              </a>
            </h2>
            <p>{data.repo.description}</p>

            <p>
              ⭐ Stars: {data.repo.stargazers_count} | 🍴 Forks: {data.repo.forks_count} | 👀 Watchers: {data.repo.watchers_count} | 🛠️ Language: {data.repo.language}
            </p>

            <p>
              📄 License: {data.repo.license?.name || "No license"} | 🐞 Open Issues: {data.repo.open_issues_count} | 🏷️ Topics:{" "}
              {data.repo.topics?.length > 0 ? data.repo.topics.join(", ") : "None"}
            </p>

            <p>
              📅 Created At: {new Date(data.repo.created_at).toLocaleDateString()} | 🔄 Updated At: {new Date(data.repo.updated_at).toLocaleDateString()}
            </p>

            {data.repo.homepage && (
              <p>
                🔗 Homepage:{" "}
                <a href={data.repo.homepage} target="_blank" rel="noopener noreferrer">
                  {data.repo.homepage}
                </a>
              </p>
            )}

            <div>
              <h4>Languages Used</h4>
              {renderLanguages(data.languages)}
            </div>
          </div>

          {/* Contributors */}
          <div style={{ marginBottom: 20 }}>
            <h3>Top Contributors</h3>
            <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
              {data.contributors.length === 0 && <p>No contributors found.</p>}
              {data.contributors.map((contributor) => (
                <a
                  key={contributor.id}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textAlign: "center", width: 80, textDecoration: "none", color: "black" }}
                >
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    style={{ width: 60, height: 60, borderRadius: "50%" }}
                  />
                  <div>{contributor.login}</div>
                  <div>({contributor.contributions})</div>
                </a>
              ))}
            </div>
          </div>

          {/* Recent commits */}
          <div>
            <h3>Recent Commits</h3>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {data.commits.length === 0 && <li>No commits found.</li>}
              {data.commits.map((commitObj) => {
                const commit = commitObj.commit;
                const authorName = commit.author?.name || "Unknown";
                const date = new Date(commit.author?.date).toLocaleString();
                return (
                  <li
                    key={commitObj.sha}
                    style={{ marginBottom: 15, borderBottom: "1px solid #eee", paddingBottom: 10 }}
                  >
                    <strong>{commit.message}</strong>
                    <div>
                      Author: {authorName} | Date: {date}
                    </div>
                    <a href={commitObj.html_url} target="_blank" rel="noopener noreferrer">
                      View Commit
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
